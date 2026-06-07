const path = require('path');

const AnalysisReport = require('../models/AnalysisReport');
const asyncHandler = require('../utils/asyncHandler');
const { parseUploadedFile } = require('../utils/fileParser');
const { analyzeRows } = require('../utils/statistics');
const { buildAutoCharts } = require('../utils/chartBuilder');
const { buildInsights } = require('../utils/insightBuilder');
const {
  getPaginationOptions,
  buildPaginationMeta,
} = require('../utils/pagination');

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

const buildFileRetentionDate = () => {
  const retentionDays = Number(process.env.FILE_RETENTION_DAYS || 7);
  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + retentionDays);

  return expiresAt;
};

const saveReport = asyncHandler(async (req, res) => {
  const { title, file, analysis, tags = [], descriptionCategory = '' } = req.body;

  const report = await AnalysisReport.create({
    title,
    originalFileName: file.originalFileName,
    storedFilePath: file.storedFilePath,
    fileType: file.fileType,
    mimeType: file.mimeType || '',
    fileSize: file.fileSize,
    fileRetentionExpiresAt: buildFileRetentionDate(),
    isOriginalFileAvailable: true,

    rowCount: analysis.rowCount,
    columnCount: analysis.columnCount,
    columns: analysis.columns || [],
    summaryStatistics: analysis.summaryStatistics,
    missingValues: analysis.missingValues,
    duplicateRowCount: analysis.duplicateRowCount,
    outlierSummary: analysis.outlierSummary,
    textualInsights: analysis.textualInsights || [],
    chartData: analysis.chartData || [],
    tablePreview: analysis.tablePreview || {},

    tags,
    descriptionCategory,
    owner: req.user._id,
  });

  return res.status(201).json({
    success: true,
    message: 'Report saved successfully',
    data: {
      report,
    },
  });
});

const getMyReports = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationOptions(req.query);

  const filter = {
    owner: req.user._id,
    isDeleted: false,
  };

  const [reports, total] = await Promise.all([
    AnalysisReport.find(filter)
      .select(
        'title originalFileName fileType fileSize rowCount columnCount tags descriptionCategory createdAt updatedAt fileRetentionExpiresAt isOriginalFileAvailable'
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    AnalysisReport.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    message: 'Reports retrieved successfully',
    data: {
      reports,
      pagination: buildPaginationMeta({ page, limit, total }),
    },
  });
});

const getReportById = asyncHandler(async (req, res) => {
  const report = await AnalysisReport.findOne({
    _id: req.params.id,
    owner: req.user._id,
    isDeleted: false,
  });

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Report retrieved successfully',
    data: {
      report,
    },
  });
});

const updateReport = asyncHandler(async (req, res) => {
  const allowedUpdates = {};

  if (req.body.title !== undefined) {
    allowedUpdates.title = req.body.title;
  }

  if (req.body.tags !== undefined) {
    allowedUpdates.tags = req.body.tags;
  }

  if (req.body.descriptionCategory !== undefined) {
    allowedUpdates.descriptionCategory = req.body.descriptionCategory;
  }

  const report = await AnalysisReport.findOneAndUpdate(
    {
      _id: req.params.id,
      owner: req.user._id,
      isDeleted: false,
    },
    allowedUpdates,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Report updated successfully',
    data: {
      report,
    },
  });
});

const softDeleteReport = asyncHandler(async (req, res) => {
  const report = await AnalysisReport.findOneAndUpdate(
    {
      _id: req.params.id,
      owner: req.user._id,
      isDeleted: false,
    },
    {
      isDeleted: true,
      deletedAt: new Date(),
    },
    {
      new: true,
    }
  );

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Report deleted from history',
    data: {
      reportId: report._id,
    },
  });
});

module.exports = {
  uploadAndParseReport,
  saveReport,
  getMyReports,
  getReportById,
  updateReport,
  softDeleteReport,
};