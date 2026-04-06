import pg from 'pg';

const pool = new pg.Pool({
    connectionString: 'postgresql://postgres:%23Pranav16@localhost:5433/mahanagarsarthidata'
});

async function run() {
    try {
        console.log("Seeding wards...");
        await pool.query(`
            INSERT INTO wards (municipal_id, name)
            SELECT 'PCM-W01', 'Ward 12 - Kothrud'
            WHERE NOT EXISTS (SELECT 1 FROM wards WHERE name = 'Ward 12 - Kothrud');
        `);

        console.log("Seeding departments...");
        const departments = [
            ['water', 'Water Supply Department'],
            ['roads', 'Roads & Infrastructure'],
            ['electricity', 'Electricity Board'],
            ['hygiene', 'Waste Management'],
            ['tax', 'Tax & Revenue Department'],
            ['hospital', 'Public Health & Hospitals'],
            ['public_transport', 'Public Transport Authority'],
            ['drainage', 'Drainage & Sewage Department'],
            ['street_lights', 'Street Lighting Department'],
            ['parks', 'Parks & Gardens Department'],
            ['other', 'General Services Department']
        ];

        for (const [category, name] of departments) {
            await pool.query(`
                INSERT INTO departments (category, name)
                SELECT $1, $2
                WHERE NOT EXISTS (SELECT 1 FROM departments WHERE category = $1);
            `, [category, name]);
        }
        
        console.log("Database seeded successfully!");
    } catch (e) {
        console.error("Error seeding:", e.message);
    } finally {
        pool.end();
    }
}

run();
