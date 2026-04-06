import pg from 'pg';
const pool = new pg.Pool({connectionString: 'postgresql://postgres:%23Pranav16@localhost:5433/mahanagarsarthidata'});

async function run() {
  try {
    console.log("Dropping tables to reset schema...");
    await pool.query('DROP TABLE IF EXISTS timeline_events CASCADE');
    await pool.query('DROP TABLE IF EXISTS media CASCADE');
    await pool.query('DROP TABLE IF EXISTS notifications CASCADE');
    await pool.query('DROP TABLE IF EXISTS complaints CASCADE');
    await pool.query('DROP TABLE IF EXISTS departments CASCADE');
    await pool.query('DROP TABLE IF EXISTS wards CASCADE');
    // I won't drop users, since the user has a test account 'Ravi Kumar'.
    
    console.log("Tables dropped.");
  } catch(e) {
    console.error(e.message);
  } finally { pool.end(); }
}
run();
