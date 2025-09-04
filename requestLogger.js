const fs = require('fs');
const path = require('path');
const cron = require('node-cron'); 

const LOG_FILE_PATH = path.join(__dirname, 'logs.json');
cron.schedule('0 0 * * *', () => {
    console.log(`[CRON JOB] Waktunya ${new Date().toLocaleTimeString()}! Membersihkan logs.json...`);
    try {
        // Tulis ulang file log dengan array kosong
        fs.writeFileSync(LOG_FILE_PATH, JSON.stringify([], null, 2));
        console.log(`[CRON JOB] File logs.json berhasil dibersihkan.`);
    } catch (err) {
        console.error(`[CRON JOB] Gagal membersihkan file logs.json:`, err);
    }
}, {
    scheduled: true,
    timezone: "Asia/Jakarta" // <-- Sangat direkomendasikan untuk menghindari masalah zona waktu
});

console.log('[CRON JOB] Penjadwal pembersihan log harian pada pukul 09:30 telah diaktifkan.');


// Inisialisasi log jika belum ada
if (!fs.existsSync(LOG_FILE_PATH)) {
    fs.writeFileSync(LOG_FILE_PATH, JSON.stringify([]));
}

// Middleware logging: hanya POST ke /upload yang dicatat
// GET ke endpoint manapun, termasuk /stats, tidak akan dicatat ke log
function requestLogger(req, res, next) {
    if (
        (req.method === 'POST' && req.path === '/upload') ||
        (req.method === 'GET' && req.path !== '/api/stats')
    ) {
        const logEntry = {
            timestamp: Date.now(),
            method: req.method
        };
        try {
            const logs = JSON.parse(fs.readFileSync(LOG_FILE_PATH, 'utf-8'));
            logs.push(logEntry);
            fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(logs, null, 2));
        } catch (err) {
            fs.writeFileSync(LOG_FILE_PATH, JSON.stringify([logEntry], null, 2));
        }
    }
    next();
}

// Reset log setiap jam 00:00
function scheduleLogReset() {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
    const msUntilMidnight = nextMidnight - now;
    setTimeout(() => {
        fs.writeFileSync(LOG_FILE_PATH, JSON.stringify([]));
        scheduleLogReset();
    }, msUntilMidnight);
}
scheduleLogReset();

module.exports = {
    requestLogger,
    LOG_FILE_PATH
};
