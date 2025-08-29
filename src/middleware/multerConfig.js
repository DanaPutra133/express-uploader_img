// src/middleware/multerConfig.js

const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // <-- 1. Impor uuid

// ... (imageFilter tidak berubah)
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar yang diizinkan!'), false);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, fileName);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;