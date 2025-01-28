import { Response } from 'express';

type TData<T> = {
    statusCode: number;
    success: boolean;
    message?: string;
    data: T;
};

const sendStatus = <T>(res: Response, data: TData<T>) => {
    res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        data: data.data,
    });
};

export default sendStatus;
