import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
const { Pool } = pg;

// Resolve .env using absolute path relative to this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.MY_DB_URL,
});

export default pool;
