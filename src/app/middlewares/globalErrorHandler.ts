/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from "express";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    const statusCode = 500;
    const message = err?.message || "Something went wrong";

    res.status(statusCode).json({
        success: false,
        message,
        error: err,
    });
};

export default globalErrorHandler;
