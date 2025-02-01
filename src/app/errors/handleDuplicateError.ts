/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
    const statusCode = status.CONFLICT;

    const errorSources: TErrorSources = [
        {
            path: Object.keys(err?.keyValue)[0],
            message: `${Object.values(err?.keyValue)[0]} is already exists`,
        },
    ];

    return {
        statusCode,
        message: 'Duplicate Error',
        errorSources,
    };
};

export default handleDuplicateError;
