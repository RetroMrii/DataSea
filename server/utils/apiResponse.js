const sendSuccess = (res, statusCode = 200, data = null, message = 'Success') => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
    const response = {
        success: false,
        message,
    };

    if (errors) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
};

module.exports = {
    sendSuccess,
    sendError,
};