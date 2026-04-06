import pg from 'pg';
import fs from 'fs';
const pool = new pg.Pool({connectionString: 'postgresql://postgres:%23Pranav16@localhost:5433/mahanagarsarthidata'});
async function run() {
  try {
     const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'");
     fs.writeFileSync('users_schema.json', JSON.stringify(res.rows, null, 2));
  } catch(e) {
     console.error(e.message);
  } finally { pool.end(); }
}
run();
