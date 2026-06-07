const path = require('path');

const asyncHandler = require('../utils/asyncHandler');
const { parseUploadedFile } = require('../utils/fileParser');
const { analyzeRows } = require('../utils/statistics');
const { buildAutoCharts } = require('../utils/chartBuilder');
const { buildInsights } = require('../utils/insightBuilder');

const uploadAndParseReport = asyncHandler(async (req, res) => {
  const parsedFile = await parseUploadedFile(req.file);

  const analysis = analyzeRows(parsedFile.rows);
  const chartData = buildAutoCharts(parsedFile.rows, analysis);
  const textualInsights = buildInsights(analysis);

  const suggestedTitle = `${path.basename(
    req.file.originalname,
    path.extname(req.file.originalname)
  )} analysis`;

  return res.status(200).json({
    success: true,
    message: 'File uploaded, parsed, and analyzed successfully',
    data: {
      file: {
        originalFileName: req.file.originalname,
        storedFileName: req.file.filename,
        storedFilePath: req.file.path,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        fileType: parsedFile.fileType,
      },
      suggestedTitle,
      analysis: {
        ...analysis,
        textualInsights,
        chartData,
      },
    },
  });
});

module.exports = {
  uploadAndParseReport,
};