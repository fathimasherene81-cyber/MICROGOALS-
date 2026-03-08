const errorHandler = (err, req, res, next) => {
    // If there's already a status code, use it; otherwise, use 500 (Server Error)
    const statusCode = res.statusCode ? res.statusCode : 500;
    
    res.status(statusCode).json({
        message: err.message,
        // Only show the "stack trace" (detailed error) if we are in development mode
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler };