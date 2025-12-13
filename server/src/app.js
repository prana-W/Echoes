import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import checkHealth from './controllers/checkHealth.controller.js';
import {errorHandler} from './middlewares/index.js';
import morgan from 'morgan';

import {
    authRouter,
    visitorsRouter,
    relationRouter,
    userRouter,
    timeCapsuleRouter,
    timeCapsuleContentRouter,
    eventsRouter,
    analyticsRouter
} from './routes/index.js';

const app = express();

app.use(morgan('dev'));

const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use(express.json());

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());

// API Routes

app.get('/', checkHealth);
app.get('/api/v1/check-health', checkHealth);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/visitors', visitorsRouter);
app.use('/api/v1/relations', relationRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/timecapsule', timeCapsuleRouter);
app.use('/api/v1/event', eventsRouter);
app.use('/api/v1/analytics', analyticsRouter);

// For Uploads

app.use('/api/v1/upload', timeCapsuleContentRouter);

// Error Handling
app.use(errorHandler());

export default app;
