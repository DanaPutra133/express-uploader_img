// src/controllers/uploadController.js

const uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Upload file gagal.' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

    console.log(`✅ Upload Sukses: file ${req.file.originalname} disimpan sebagai ${req.file.filename}`);

    res.status(201).json({
        message: 'Gambar berhasil di-upload!',
        url: imageUrl
    });
};

module.exports = {
    uploadImage
};