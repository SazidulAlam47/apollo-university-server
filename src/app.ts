import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import config from './app/config';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: [config.client_url as string], credentials: true }));

// application routes
app.use('/api/v1', router);

const test = (req: Request, res: Response) => {
    res.send('Apollo University Server is Running...');
};

app.get('/', test);

// global error handler
app.use(globalErrorHandler);

// not found route
app.use(notFound);

export default app;
