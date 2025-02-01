/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express';
import status from 'http-status';
import { ZodError } from 'zod';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';
import handleZodError from '../errors/handleZodError';
import config from '../config';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let statusCode = err?.statusCode || status.INTERNAL_SERVER_ERROR;
    let message = err?.message || 'Something went wrong';
    let errorSources: TErrorSources = [
        {
            path: '',
            message: 'Something went wrong',
        },
    ];

    let simplifiedError: TGenericErrorResponse | undefined = undefined;

    if (err instanceof ZodError) {
        simplifiedError = handleZodError(err);
    } else if (err?.name === 'ValidationError') {
        simplifiedError = handleValidationError(err);
    } else if (err?.name === 'CastError') {
        simplifiedError = handleCastError(err);
    } else if (err?.code === 11000) {
        simplifiedError = handleDuplicateError(err);
    }

    if (simplifiedError) {
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSources = simplifiedError?.errorSources;
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack: config.NODE_ENV === 'development' ? err?.stack : undefined,
        err,
    });
};

export default globalErrorHandler;
