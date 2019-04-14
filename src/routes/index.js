import Router from 'koa-router';

import { wrapper } from 'koa-swagger-decorator';
import UserRouter from './user';
import ArticleRouter from './article';
import TagRouter from './tag'

const router = new Router();
wrapper(router);

router.swagger({
  title: 'NOTEPAD-SERVER',
  description: 'API DOC',
  version: '0.0.1'
});
router.map(UserRouter);
router.map(ArticleRouter);
router.map(TagRouter)

export default router;
