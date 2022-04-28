import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import {
  healthCheck,
  errorHandler,
  isLocal,
} from '@crustnft-explore/util-config-api';
import registerRoutes from './endpoints';

const app: express.Application = express();

app.disable('etag').disable('x-powered-by');
app.use(
  cors({
    maxAge: 24 * 60 * 60,
  })
);

if (isLocal()) {
  app.use(morgan('dev'));
}
app.use(bodyParser.json());
app.use(healthCheck());
registerRoutes(app);

app.use(errorHandler());

export default app;
