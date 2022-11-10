const errorHandler = (err, req, res, next) => {
    // if a status code is set when an error is thrown it will be used
    // otherwise an error code of 500 will be thrown
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);

    res.json({
        message: err.message,
        // stack trace will be hidden in production
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

module.exports = { errorHandler };
