import { Router } from 'express';
import { healthRouter } from './health';
import { documentRouter } from './documents.routes';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/documents', documentRouter);
