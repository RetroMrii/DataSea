const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadsDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const allowedExtensions = ['.csv', '.json', '.xlsx'];

const allowedMimeTypes = [
  'text/csv',
  'application/csv',
  'application/json',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/octet-stream',
];

const getMaxFileSizeBytes = () => {
  const maxFileSizeMb = Number(process.env.MAX_FILE_SIZE_MB || 20);
  return maxFileSizeMb * 1024 * 1024;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },

  filename: (req, file, cb) => {
    const originalExt = path.extname(file.originalname).toLowerCase();
    const safeBaseName = path
      .basename(file.originalname, originalExt)
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .slice(0, 60);

    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeBaseName}${originalExt}`;

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  const isAllowedExtension = allowedExtensions.includes(extension);
  const isAllowedMimeType = allowedMimeTypes.includes(file.mimetype);

  if (!isAllowedExtension) {
    return cb(
      new Error('Unsupported file extension. Only CSV, JSON, and XLSX files are allowed.'),
      false
    );
  }

  if (!isAllowedMimeType) {
    return cb(
      new Error('Unsupported file type. Only CSV, JSON, and XLSX files are allowed.'),
      false
    );
  }

  cb(null, true);
};

const uploadDataset = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: getMaxFileSizeBytes(),
    files: 1,
  },
});

module.exports = {
  uploadDataset,
};