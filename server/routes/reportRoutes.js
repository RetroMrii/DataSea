const express = require('express');

const { protect } = require('../middleware/authMiddleware');
const { uploadDataset } = require('../middleware/upload');
const validateObjectId = require('../middleware/validateObjectId');
const validate = require('../middleware/validate');
const {
  saveReportSchema,
  updateReportSchema,
} = require('../validation/reportValidation');

const {
  uploadAndParseReport,
  saveReport,
  getMyReports,
  getReportById,
  updateReport,
  softDeleteReport,
} = require('../controllers/reportController');

const router = express.Router();

router.use(protect);

router.post('/upload', uploadDataset.single('dataset'), uploadAndParseReport);

router
  .route('/')
  .get(getMyReports)
  .post(validate(saveReportSchema), saveReport);

router
  .route('/:id')
  .all(validateObjectId('id'))
  .get(getReportById)
  .put(validate(updateReportSchema), updateReport)
  .delete(softDeleteReport);

module.exports = router;