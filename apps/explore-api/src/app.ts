import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { healthCheck, errorHandler } from '@crustnft-explore/util-config-api';
import registerRoutes from './endpoints';

const app: express.Application = express();

app.use(
  cors({
    maxAge: 24 * 60 * 60,
  })
);

app.use(bodyParser.json());
app.use(healthCheck());
registerRoutes(app);

app.use(errorHandler());

export default app;
