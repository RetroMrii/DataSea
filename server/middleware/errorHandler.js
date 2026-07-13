const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || res.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'File is too large. Please upload a smaller file.',
        });
    }

    if (err.name === 'MulterError') {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    if (err.message?.includes('Only CSV, JSON, and XLSX')) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    if (
        err.message?.includes('Unsupported file extension') ||
        err.message?.includes('Unsupported file type')
    ) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    if (process.env.NODE_ENV === 'development') {
        console.error(err);
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;