import Router from 'koa-router';

import BasicRouter from './basic';
import { wrapper } from 'koa-swagger-decorator';

const router = new Router();
wrapper(router);

router.swagger({ title: 'SERVER', description: 'API DOC', version: '1.0.0' });
router.map(BasicRouter);

export default router;
