import status from 'http-status';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

export const duplicateErrorRegex =
    /E11000 duplicate key error collection: .* index: (\w+)_\d+ dup key: { \1: "([^"]+)" }/;

const handleDuplicateError = (
    match: RegExpMatchArray,
): TGenericErrorResponse => {
    const statusCode = status.CONFLICT;

    const errorSources: TErrorSources = [
        {
            path: match[1],
            message: `${match[2]} is already exits`,
        },
    ];

    return {
        statusCode,
        message: `${match[2]} is already exits`,
        errorSources,
    };
};

export default handleDuplicateError;
