import { Response } from 'express';

interface TMeta {
    page: number;
    limit: number;
    totalData: number;
    totalPage: number;
}

type TData<T> = {
    statusCode: number;
    success: boolean;
    message?: string;
    meta?: TMeta;
    data: T;
};

const sendResponse = <T>(res: Response, data: TData<T>) => {
    res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        meta: data.meta,
        data: data.data,
    });
};

export default sendResponse;
