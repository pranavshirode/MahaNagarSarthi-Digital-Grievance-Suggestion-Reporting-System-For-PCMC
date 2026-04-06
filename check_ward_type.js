import pg from 'pg';
const pool = new pg.Pool({connectionString: 'postgresql://postgres:%23Pranav16@localhost:5433/mahanagarsarthidata'});
async function run() {
  try {
     const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'wards' AND column_name = 'municipal_id'");
     console.log(res.rows);
  } catch(e) {
     console.error(e.message);
  } finally { pool.end(); }
}
run();
