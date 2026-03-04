import { Router } from 'express';
import { healthRouter } from './health';
import { documentRouter } from './documents.routes';
import { requireUser } from '../middleware/require-user';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/documents', requireUser, documentRouter);
