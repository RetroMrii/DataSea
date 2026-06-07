const Joi = require('joi');

const descriptionCategories = [
  'sales',
  'finance',
  'education',
  'operations',
  'research',
  'marketing',
  'personal',
  'other',
  '',
];

const saveReportSchema = Joi.object({
  title: Joi.string().trim().min(2).max(120).required().messages({
    'string.empty': 'Report title is required',
    'string.min': 'Report title must be at least 2 characters long',
    'string.max': 'Report title cannot exceed 120 characters',
  }),

  file: Joi.object({
    originalFileName: Joi.string().trim().required(),
    storedFileName: Joi.string().trim().required(),
    storedFilePath: Joi.string().trim().required(),
    mimeType: Joi.string().allow('').default(''),
    fileSize: Joi.number().min(0).required(),
    fileType: Joi.string().valid('csv', 'json', 'xlsx').required(),
  }).required(),

  analysis: Joi.object({
    rowCount: Joi.number().min(0).required(),
    columnCount: Joi.number().min(0).required(),
    columns: Joi.array().items(Joi.object()).default([]),
    summaryStatistics: Joi.object().required(),
    missingValues: Joi.object().required(),
    duplicateRowCount: Joi.number().min(0).required(),
    outlierSummary: Joi.object().required(),
    textualInsights: Joi.array().items(Joi.string()).default([]),
    chartData: Joi.array().items(Joi.object()).default([]),
    tablePreview: Joi.object().default({}),
  }).required(),

  tags: Joi.array()
    .items(Joi.string().trim().min(1).max(40))
    .max(10)
    .default([]),

  descriptionCategory: Joi.string()
    .valid(...descriptionCategories)
    .default(''),
});

const updateReportSchema = Joi.object({
  title: Joi.string().trim().min(2).max(120).messages({
    'string.min': 'Report title must be at least 2 characters long',
    'string.max': 'Report title cannot exceed 120 characters',
  }),

  tags: Joi.array()
    .items(Joi.string().trim().min(1).max(40))
    .max(10),

  descriptionCategory: Joi.string().valid(...descriptionCategories),
}).min(1);

module.exports = {
  saveReportSchema,
  updateReportSchema,
};