import pg from 'pg';
const { Client } = pg;

async function init() {
  console.log('Connecting to default postgres database...');
  const setupClient = new Client({
    user: 'postgres',
    password: '#Pranav16',
    host: 'localhost',
    port: 5432,
    database: 'postgres'
  });

  try {
    await setupClient.connect();
    // Check if database exists
    const res = await setupClient.query(`SELECT 1 FROM pg_database WHERE datname = 'MahanagarsarthiData'`);
    if (res.rowCount === 0) {
      console.log('Database MahanagarsarthiData does not exist. Creating...');
      await setupClient.query(`CREATE DATABASE "MahanagarsarthiData"`);
      console.log('Database created successfully.');
    } else {
      console.log('Database MahanagarsarthiData already exists.');
    }
  } catch (err) {
    console.error('Error during database creation:', err);
    process.exit(1);
  } finally {
    await setupClient.end();
  }

  console.log('Connecting to MahanagarsarthiData...');
  const client = new Client({
    user: 'postgres',
    password: '#Pranav16',
    host: 'localhost',
    port: 5432,
    database: 'MahanagarsarthiData'
  });

  try {
    await client.connect();
    
    // Create UUID extension
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    console.log('Creating tables...');
    
    const ddl = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        municipal_id VARCHAR(50),
        name VARCHAR(100) NOT NULL,
        mobile VARCHAR(20) UNIQUE NOT NULL,
        phone_number VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'citizen',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS wards (
        id SERIAL PRIMARY KEY,
        municipal_id VARCHAR(50),
        name VARCHAR(100) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        category VARCHAR(50) NOT NULL,
        ward_id INTEGER REFERENCES wards(id),
        name VARCHAR(100) NOT NULL,
        contact_phone VARCHAR(20)
      );

      CREATE TABLE IF NOT EXISTS officers (
        id SERIAL PRIMARY KEY,
        department_id INTEGER REFERENCES departments(id),
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        is_available BOOLEAN DEFAULT TRUE
      );

      CREATE TABLE IF NOT EXISTS complaints (
        id SERIAL PRIMARY KEY,
        complaint_no VARCHAR(50) UNIQUE,
        category VARCHAR(50) NOT NULL,
        ward_id INTEGER REFERENCES wards(id),
        department_id INTEGER REFERENCES departments(id),
        user_id UUID REFERENCES users(id),
        assigned_officer_id INTEGER REFERENCES officers(id),
        title VARCHAR(150),
        description TEXT,
        severity INTEGER DEFAULT 2,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        address_text TEXT,
        status VARCHAR(50) DEFAULT 'submitted',
        resolution_note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        acknowledged_at TIMESTAMP,
        assigned_at TIMESTAMP,
        resolved_at TIMESTAMP,
        closed_at TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS timeline_events (
        id SERIAL PRIMARY KEY,
        complaint_id INTEGER REFERENCES complaints(id) ON DELETE CASCADE,
        status VARCHAR(50),
        actor_type VARCHAR(50),
        actor_id INTEGER,
        note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS media (
        id SERIAL PRIMARY KEY,
        complaint_id INTEGER REFERENCES complaints(id) ON DELETE CASCADE,
        s3_key VARCHAR(255),
        s3_bucket VARCHAR(100),
        mime_type VARCHAR(50),
        size_bytes INTEGER
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        complaint_id INTEGER REFERENCES complaints(id),
        channel VARCHAR(50),
        message TEXT,
        status VARCHAR(50),
        sent_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Seed initial ward and departments if empty
      INSERT INTO wards (municipal_id, name)
      SELECT 'PCM-W01', 'Ward 12 - Kothrud'
      WHERE NOT EXISTS (SELECT 1 FROM wards WHERE name = 'Ward 12 - Kothrud');
      
      INSERT INTO departments (category, name)
      SELECT 'water', 'Water Supply Department'
      WHERE NOT EXISTS (SELECT 1 FROM departments WHERE category = 'water');

      INSERT INTO departments (category, name)
      SELECT 'roads', 'Roads & Infrastructure'
      WHERE NOT EXISTS (SELECT 1 FROM departments WHERE category = 'roads');
      
      INSERT INTO departments (category, name)
      SELECT 'electricity', 'Electricity Board'
      WHERE NOT EXISTS (SELECT 1 FROM departments WHERE category = 'electricity');
      
      INSERT INTO departments (category, name)
      SELECT 'hygiene', 'Waste Management'
      WHERE NOT EXISTS (SELECT 1 FROM departments WHERE category = 'hygiene');

      INSERT INTO departments (category, name)
      SELECT 'tax', 'Tax & Revenue Department'
      WHERE NOT EXISTS (SELECT 1 FROM departments WHERE category = 'tax');

      INSERT INTO departments (category, name)
      SELECT 'hospital', 'Public Health & Hospitals'
      WHERE NOT EXISTS (SELECT 1 FROM departments WHERE category = 'hospital');

      INSERT INTO departments (category, name)
      SELECT 'public_transport', 'Public Transport Authority'
      WHERE NOT EXISTS (SELECT 1 FROM departments WHERE category = 'public_transport');

      INSERT INTO departments (category, name)
      SELECT 'drainage', 'Drainage & Sewage Department'
      WHERE NOT EXISTS (SELECT 1 FROM departments WHERE category = 'drainage');

      INSERT INTO departments (category, name)
      SELECT 'street_lights', 'Street Lighting Department'
      WHERE NOT EXISTS (SELECT 1 FROM departments WHERE category = 'street_lights');

      INSERT INTO departments (category, name)
      SELECT 'parks', 'Parks & Gardens Department'
      WHERE NOT EXISTS (SELECT 1 FROM departments WHERE category = 'parks');

      INSERT INTO departments (category, name)
      SELECT 'other', 'General Services Department'
      WHERE NOT EXISTS (SELECT 1 FROM departments WHERE category = 'other');
      
      -- Create sequence for complaint_no
      CREATE SEQUENCE IF NOT EXISTS complaint_seq START 1;
      
      -- Create function and trigger to auto-generate complaint_no
      CREATE OR REPLACE FUNCTION generate_complaint_no()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.complaint_no IS NULL THEN
          NEW.complaint_no := 'NS-' || to_char(CURRENT_DATE, 'YYYY') || '-' || LPAD(nextval('complaint_seq')::text, 6, '0');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS trg_generate_complaint_no ON complaints;
      
      CREATE TRIGGER trg_generate_complaint_no
      BEFORE INSERT ON complaints
      FOR EACH ROW
      EXECUTE PROCEDURE generate_complaint_no();
    `;

    await client.query(ddl);
    console.log('Successfully created all tables, sequences, triggers, and seed data.');

  } catch (err) {
    console.error('Error executing DDL:', err);
  } finally {
    await client.end();
  }
}

init();
