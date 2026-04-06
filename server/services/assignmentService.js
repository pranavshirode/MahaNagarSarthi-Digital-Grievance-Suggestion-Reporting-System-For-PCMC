import db from "../config/db.js";

/**
 * Find the best matching department for a given ward and category.
 * Falls back to a city-wide department (ward_id IS NULL) if no ward-specific one exists.
 */
export async function assignDepartment(wardId, category, client = db) {
    const { rows } = await client.query(
        `SELECT id, name, contact_phone
     FROM departments
     WHERE category = $1
       AND (ward_id = $2 OR ward_id IS NULL)
     ORDER BY ward_id NULLS LAST
     LIMIT 1`,
        [category, wardId]
    );
    return rows[0] || null;
}
