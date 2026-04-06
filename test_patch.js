import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });

async function run() {
  try {
    const token = jwt.sign({ id: 0, role: 'admin' }, process.env.JWT_SECRET || 'fallback_secret_key_123');
    
    // Assumes complaint ID 1 exists
    const res = await fetch('http://localhost:5000/api/complaints/1/status', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ status: 'in_progress', note: 'Test remark' })
    });
    
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch(e) {
    console.error('Fetch error:', e.message);
  }
}
run();
