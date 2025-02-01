import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';
import status from 'http-status';

const handleCastError = (
    err: mongoose.Error.CastError,
): TGenericErrorResponse => {
    const statusCode = status.BAD_REQUEST;
    const errorSources: TErrorSources = [
        {
            path: err.path,
            message: err.message,
        },
    ];
    return {
        statusCode,
        message: 'Invalid ID',
        errorSources,
    };
};

export default handleCastError;
