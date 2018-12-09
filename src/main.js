import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa-cors';
import config from './config'
import db from './db';
import errorHandle from './middlewares/errorHandle';
import router from './routes';

db.init();

const app = new Koa();

app
.use(cors())
.use(bodyParser())
.use(errorHandle())
.use(router.routes())
.use(router.allowedMethods());

app.listen(config.port, () => {
  console.log(`App is listening on ${config.port} [ENV: ${process.env.NODE_ENV}]`);
});
