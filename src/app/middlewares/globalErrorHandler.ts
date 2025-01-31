/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express';
import status from 'http-status';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    const statusCode = err?.statusCode || status.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json({
        success: false,
        message: err?.message || 'Something went wrong',
        error: err,
    });
};

export default globalErrorHandler;
