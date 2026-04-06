import pg from 'pg';
import fs from 'fs';

const pool = new pg.Pool({connectionString: 'postgresql://postgres:%23Pranav16@localhost:5433/mahanagarsarthidata'});

async function run() {
  try {
    console.log("Dropping ALL tables to start fresh...");
    await pool.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
    `);
    
    console.log("Loading DDL...");
    const code = fs.readFileSync('server/init_new_schema.js', 'utf8');
    const start = code.indexOf('const ddl = `') + 13;
    const end = code.indexOf('`;', start);
    let ddl = code.substring(start, end);
    
    // I need to use the original DDL from the codebase, but I had updated user_id to UUID. Let me replace it back to INTEGER inside the string so it creates cleanly.
    ddl = ddl.replace(/user_id UUID REFERENCES users\(id\)/g, "user_id INTEGER REFERENCES users(id)");
    
    console.log("Executing DDL...");
    await pool.query(ddl);
    
    console.log("Seeding test user...");
    // Insert a test user so the citizen login works
    await pool.query(`
      INSERT INTO users (municipal_id, name, mobile, phone_number, password, role)
      VALUES ('PCM-W01', 'Test Citizen', '9999999999', '9999999999', 'password123', 'citizen')
    `);
    
    console.log("Successfully recreated EVERYTHING from scratch and seeded data.");
  } catch(e) {
    console.error(e.message);
  } finally {
    pool.end();
  }
}
run();
