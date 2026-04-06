import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });

async function run() {
  try {
    const citizenId = 1;
    const token = jwt.sign({ id: citizenId, role: 'citizen' }, process.env.JWT_SECRET || 'fallback_secret_key_123');
    const res = await fetch('http://localhost:5000/api/complaints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ category: 'water', title: 'Test 5', description: 'Test', latitude: 18, longitude: 73 })
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch(e) {
    console.error(e.message);
  }
}
run();
