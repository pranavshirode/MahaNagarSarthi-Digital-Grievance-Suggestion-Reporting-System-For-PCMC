import pg from 'pg';
import fs from 'fs';

const pool = new pg.Pool({connectionString: 'postgresql://postgres:%23Pranav16@localhost:5433/mahanagarsarthidata'});

async function run() {
  try {
    console.log("Loading DDL...");
    const code = fs.readFileSync('server/init_new_schema.js', 'utf8');
    const start = code.indexOf('const ddl = `') + 13;
    const end = code.indexOf('`;', start);
    const ddl = code.substring(start, end);
    
    console.log("Executing DDL...");
    await pool.query(ddl);
    console.log("Successfully recreated schema and seeded data.");
  } catch(e) {
    console.error(e.message);
  } finally {
    pool.end();
  }
}
run();
