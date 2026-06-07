const express = require('express');

const { protect } = require('../middleware/authMiddleware');
const { uploadDataset } = require('../middleware/upload');
const { uploadAndParseReport } = require('../controllers/reportController');

const router = express.Router();

router.post('/upload', protect, uploadDataset.single('dataset'), uploadAndParseReport);

module.exports = router;