// src/server.js

require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const uploadRoutes = require('./routes/uploadRoutes');
const fs = require('fs'); 

const { requestLogger } = require('../requestLogger');

const LOG_FILE_PATH_STATS = path.join(__dirname, '../logs.json');

function getStartOfMinute(timestamp) {
    const msInMinute = 60 * 1000; // 60.000 milidetik dalam satu menit
    // Ini adalah cara matematis untuk membulatkan timestamp ke bawah ke awal menit
    return timestamp - (timestamp % msInMinute);
}


const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log(`Folder "uploads" tidak ditemukan, berhasil dibuat.`);
}

const app = express();
const port = 3000;

app.set('trust proxy', 1);

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(requestLogger);

app.use('/images', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/upload', uploadRoutes);

app.use((err, req, res, next) => {
    console.error(`❌ Error terdeteksi oleh error handler: ${err.message}`);
    
    if (err instanceof require('multer').MulterError) {
        return res.status(400).json({ error: `Upload Error: ${err.message}` });
    } else if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
});

app.get('/api/stats', (req, res) => {
   
    try {
        let rawLogs = [];
        if (fs.existsSync(LOG_FILE_PATH_STATS)) {
            const logData = fs.readFileSync(LOG_FILE_PATH_STATS, 'utf-8');
            rawLogs = JSON.parse(logData);
        } else {
        }

        const now = Date.now();
        const oneHourAgo = now - (60 * 60 * 1000);
        const recentLogs = rawLogs.filter(log => log.timestamp >= oneHourAgo);

        const minuteData = new Map();
        for (let i = 0; i < 60; i++) {
            const minuteTimestamp = now - (i * 60 * 1000);
            const startOfMinute = getStartOfMinute(minuteTimestamp);
            if (!minuteData.has(startOfMinute)) {
                minuteData.set(startOfMinute, { GET: 0, POST: 0, PUT: 0, DELETE: 0 });
            }
        }
        
        recentLogs.forEach(log => {
            const logMinuteTimestamp = getStartOfMinute(log.timestamp);
            const slot = minuteData.get(logMinuteTimestamp);

            // LOG PALING PENTING ADA DI SINI
            if (slot) {
                if (slot.hasOwnProperty(log.method)) {
                    slot[log.method]++;
                }
            } else {
            }
        });

        const chartData = Array.from(minuteData.entries())
            .map(([timestamp, counts]) => ({ timestamp, ...counts }))
            .sort((a, b) => a.timestamp - b.timestamp);
        
        res.json({ status: true, data: chartData });

    } catch (error) {
        console.error("Gagal membaca atau memproses statistik:", error);
        res.status(500).json({ status: false, message: 'Gagal memproses statistik.' });
    }
});

app.listen(port, () => {
    console.log(`🚀 Backend Uploader Service berjalan di http://localhost:${port}`);
});