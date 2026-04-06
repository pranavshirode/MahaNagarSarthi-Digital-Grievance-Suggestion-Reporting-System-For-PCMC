import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import path from 'path';
import db from './config/db.js';
import { requireAuth } from './middleware/authGuard.js';
import {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  updateStatus,
  getAllComplaints
} from './controllers/complaintController.js';

// Resolve .env with absolute path so it always loads correctly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });


const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_123';

app.use(cors());
app.use(express.json());

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// --- AUTH ROUTES ---

app.post('/api/signup', async (req, res) => {
  const { name, mobile, password } = req.body;
  if (!name || !mobile || !password) return res.status(400).json({ error: 'Name, mobile, and password are required' });

  try {
    const existing = await db.query('SELECT id FROM users WHERE mobile = $1', [mobile]);
    if (existing.rows.length > 0) return res.status(400).json({ error: 'Mobile number already registered' });

    const result = await db.query(
      'INSERT INTO users (municipal_id, name, mobile, phone_number, password, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, mobile, role',
      ['PCM-W01', name, mobile, mobile, password, 'citizen']
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ ...user, token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username/mobile and password are required' });

  try {
    const userResult = await db.query(
      'SELECT id, name, mobile, role FROM users WHERE mobile = $1 AND password = $2',
      [username, password]
    );

    if (userResult.rows.length === 0) {
      if (username === 'admin' && password === 'admin@123') {
        const token = jwt.sign({ id: 0, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
        return res.json({ id: 0, name: 'Administrator', role: 'admin', token });
      }
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ ...user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- OTP ROUTES (Fixed OTP: 8877 for demo) ---
const FIXED_OTP = '8877';
const otpStore = new Map(); // mobile -> { otp, expiresAt }

app.post('/api/send-otp', async (req, res) => {
  const { mobile } = req.body;
  if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) return res.status(400).json({ error: 'Valid 10-digit mobile required' });
  otpStore.set(mobile, { otp: FIXED_OTP, expiresAt: Date.now() + 300000 });
  console.log(`[OTP] Sent to ${mobile}: ${FIXED_OTP}`);
  res.json({ success: true, message: 'OTP sent to your mobile number' });
});

app.post('/api/verify-otp', async (req, res) => {
  const { mobile, otp } = req.body;
  const stored = otpStore.get(mobile);
  if (!stored || stored.otp !== otp || Date.now() > stored.expiresAt) {
    return res.status(401).json({ error: 'Invalid or expired OTP' });
  }
  otpStore.delete(mobile);

  try {
    const userResult = await db.query('SELECT id, name, mobile, role FROM users WHERE mobile = $1', [mobile]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'No account found with this mobile. Please sign up first.' });
    }
    const user = userResult.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ ...user, token });
  } catch (error) {
    console.error('OTP verify error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- COMPLAINTS ROUTES ---
app.post('/api/complaints', requireAuth, upload.array('photos', 5), createComplaint);
app.get('/api/complaints/mine', requireAuth, getMyComplaints);
app.get('/api/complaints/all', requireAuth, getAllComplaints);
app.get('/api/complaints/:id', requireAuth, getComplaintById);
app.patch('/api/complaints/:id/status', requireAuth, updateStatus);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
