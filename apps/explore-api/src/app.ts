import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import endpoints from './endpoints';
import { errorHandler } from './middlewares/error-handler';
import healthCheck from './middlewares/health-check';
import httpLogger from 'koa-logger';

const app = new Koa();

if (process.env.APP_ENV === 'local') {
  app.use(httpLogger());
}
app.use(
  cors({
    maxAge: 3600,
  })
);
app.use(healthCheck());
app.use(bodyParser());
app.use(errorHandler());
app.use(endpoints);

export default app;
