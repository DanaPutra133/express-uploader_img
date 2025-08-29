// src/server.js

require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const uploadRoutes = require('./routes/uploadRoutes');
const fs = require('fs'); 

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

app.listen(port, () => {
    console.log(`🚀 Backend Uploader Service berjalan di http://localhost:${port}`);
});