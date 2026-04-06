import pg from 'pg';
const pool = new pg.Pool({connectionString: 'postgresql://postgres:%23Pranav16@localhost:5433/mahanagarsarthidata'});
async function run() {
  try {
     const status = 'in_progress';
     const id = 1;
     const note = 'Test remark';
     await pool.query(
      `UPDATE complaints SET status = CAST($1 AS VARCHAR),
         acknowledged_at = CASE WHEN CAST($1 AS VARCHAR) = 'acknowledged' THEN NOW() ELSE acknowledged_at END,
         assigned_at     = CASE WHEN CAST($1 AS VARCHAR) = 'assigned'     THEN NOW() ELSE assigned_at END,
         resolved_at     = CASE WHEN CAST($1 AS VARCHAR) = 'resolved'     THEN NOW() ELSE resolved_at END,
         closed_at       = CASE WHEN CAST($1 AS VARCHAR) = 'closed'       THEN NOW() ELSE closed_at END,
         resolution_note = COALESCE(CAST($3 AS TEXT), resolution_note)
       WHERE id = $2`,
      [status, id, note || null]
    );
     console.log('Query success');
  } catch(e) {
     console.error('Expected error:', e.message);
  } finally { pool.end(); }
}
run();
