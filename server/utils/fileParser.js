const fs = require('fs/promises');
const path = require('path');
const { parse } = require('csv-parse/sync');
const XLSX = require('xlsx');

const getFileTypeFromName = (fileName) => {
  const extension = path.extname(fileName).toLowerCase();

  if (extension === '.csv') return 'csv';
  if (extension === '.json') return 'json';
  if (extension === '.xlsx') return 'xlsx';

  return null;
};

const normalizeValue = (value) => {
  if (value === null || value === undefined) return '';

  if (value instanceof Date) {
    return value.toISOString();
  }

  return value;
};

const normalizeRows = (rows) => {
  return rows.map((row) => {
    const normalizedRow = {};

    Object.keys(row).forEach((key) => {
      const safeKey = String(key).trim();
      normalizedRow[safeKey] = normalizeValue(row[key]);
    });

    return normalizedRow;
  });
};

const parseCsvFile = async (filePath) => {
  const content = await fs.readFile(filePath, 'utf8');

  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  });

  return normalizeRows(records);
};

const parseJsonFile = async (filePath) => {
  const content = await fs.readFile(filePath, 'utf8');
  const parsed = JSON.parse(content);

  if (Array.isArray(parsed)) {
    return normalizeRows(parsed);
  }

  if (parsed && typeof parsed === 'object') {
    const arrayValue = Object.values(parsed).find((value) => Array.isArray(value));

    if (arrayValue) {
      return normalizeRows(arrayValue);
    }

    return normalizeRows([parsed]);
  }

  throw new Error('JSON file must contain an object, an array of objects, or an object with an array field.');
};

const parseXlsxFile = async (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error('XLSX file does not contain any sheets.');
  }

  const worksheet = workbook.Sheets[firstSheetName];

  const rows = XLSX.utils.sheet_to_json(worksheet, {
    defval: '',
    raw: false,
  });

  return normalizeRows(rows);
};

const getColumnsFromRows = (rows) => {
  const columnSet = new Set();

  rows.forEach((row) => {
    Object.keys(row).forEach((key) => columnSet.add(key));
  });

  return Array.from(columnSet);
};

const parseUploadedFile = async (file) => {
  if (!file) {
    const error = new Error('No file uploaded.');
    error.statusCode = 400;
    throw error;
  }

  const fileType = getFileTypeFromName(file.originalname);

  if (!fileType) {
    const error = new Error('Unsupported file type.');
    error.statusCode = 400;
    throw error;
  }

  let rows;

  if (fileType === 'csv') {
    rows = await parseCsvFile(file.path);
  }

  if (fileType === 'json') {
    rows = await parseJsonFile(file.path);
  }

  if (fileType === 'xlsx') {
    rows = await parseXlsxFile(file.path);
  }

  if (!Array.isArray(rows)) {
    const error = new Error('Parsed file did not produce rows.');
    error.statusCode = 400;
    throw error;
  }

  const columns = getColumnsFromRows(rows);

  return {
    fileType,
    rowCount: rows.length,
    columnCount: columns.length,
    columns,
    previewRows: rows.slice(0, 20),
  };
};

module.exports = {
  parseUploadedFile,
  getFileTypeFromName,
};