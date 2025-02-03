import status from 'http-status';
import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleValidationError = (
    err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
    const statusCode = status.BAD_REQUEST;

    const errorSources: TErrorSources = Object.values(err.errors).map(
        (value: mongoose.Error.ValidatorError | mongoose.Error.CastError) => ({
            path: value?.path,
            message: value?.message,
        }),
    );

    return {
        statusCode,
        message: 'Validation Error',
        errorSources,
    };
};

export default handleValidationError;
