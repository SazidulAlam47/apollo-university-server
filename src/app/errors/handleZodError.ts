import status from 'http-status';
import { ZodError, ZodIssue } from 'zod';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
    const statusCode = status.UNPROCESSABLE_ENTITY;
    const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => ({
        path: issue.path[issue.path.length - 1],
        message: issue.message,
    }));

    return {
        statusCode,
        message: 'Validation Error',
        errorSources,
    };
};

export default handleZodError;
