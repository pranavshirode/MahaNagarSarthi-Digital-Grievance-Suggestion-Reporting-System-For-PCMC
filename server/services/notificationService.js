import db from "../config/db.js";

/**
 * Send a notification and log it in the notifications table.
 * Currently supports: sms (MSG91)
 */
export async function sendNotification({ userId, complaintId, channel, message }) {
    // Log first so we have a record even if delivery fails
    const { rows } = await db.query(
        `INSERT INTO notifications (user_id, complaint_id, channel, message, status)
     VALUES ($1, $2, $3, $4, 'pending')
     RETURNING id`,
        [userId, complaintId || null, channel, message]
    );
    const notifId = rows[0].id;

    try {
        if (channel === "sms") {
            await sendSMS(userId, message);
        }
        await db.query(
            `UPDATE notifications SET status = 'sent', sent_at = NOW() WHERE id = $1`,
            [notifId]
        );
    } catch (err) {
        await db.query(
            `UPDATE notifications SET status = 'failed' WHERE id = $1`,
            [notifId]
        );
        throw err;
    }
}

async function sendSMS(userId, message) {
    // Fetch user phone
    const { rows } = await db.query(`SELECT phone_number FROM users WHERE id = $1`, [userId]);
    const phone = rows[0]?.phone_number;
    if (!phone) throw new Error("User phone not found");

    if (!process.env.MSG91_AUTH_KEY) {
        console.log(`[MOCK SMS TO ${phone}]: ${message}`);
        return;
    }

    // MSG91 API
    const res = await fetch("https://api.msg91.com/api/v5/flow/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authkey: process.env.MSG91_AUTH_KEY,
        },
        body: JSON.stringify({
            flow_id: process.env.MSG91_FLOW_ID,
            sender: process.env.MSG91_SENDER_ID || "NAGRIK",
            mobiles: phone.replace("+", ""),
            VAR1: message,
        }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`MSG91 error: ${text}`);
    }
}
