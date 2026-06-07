const asyncHandler = require('../utils/asyncHandler');
const { parseUploadedFile } = require('../utils/fileParser');

const uploadAndParseReport = asyncHandler(async (req, res) => {
  const parsedFile = await parseUploadedFile(req.file);

  return res.status(200).json({
    success: true,
    message: 'File uploaded and parsed successfully',
    data: {
      file: {
        originalFileName: req.file.originalname,
        storedFileName: req.file.filename,
        storedFilePath: req.file.path,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        fileType: parsedFile.fileType,
      },
      parsed: {
        rowCount: parsedFile.rowCount,
        columnCount: parsedFile.columnCount,
        columns: parsedFile.columns,
        previewRows: parsedFile.previewRows,
      },
    },
  });
});

module.exports = {
  uploadAndParseReport,
};