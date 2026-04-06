const pg = require('pg');
const pool = new pg.Pool({connectionString: 'postgresql://postgres:%23Pranav16@localhost:5433/mahanagarsarthidata'});

async function run() {
  try {
    const wards = await pool.query('SELECT * FROM wards');
    console.log(`Wards count: ${wards.rowCount}`);
    
    const depts = await pool.query('SELECT * FROM departments');
    console.log(`Departments count: ${depts.rowCount}`);
  } catch(e) {
    console.error(e.message);
  } finally {
    pool.end();
  }
}
run();
