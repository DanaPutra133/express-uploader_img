

const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const uploadMiddleware = require('../middleware/multerConfig');
const validateApiKey = require('../middleware/auth');
router.post('/', validateApiKey, uploadMiddleware.single('imageFile'), uploadController.uploadImage);

module.exports = router;