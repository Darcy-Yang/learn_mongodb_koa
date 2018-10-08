import mongoose from 'mongoose';
const Koa = require('koa');
const router = require('koa-router')();

const bodyParser = require('koa-bodyparser');

const app = new Koa();
// const router = new Router();

// 中间件;
const loggerAsync = require('./middleware/logger-async');

app.use(loggerAsync());

app.use(bodyParser());

app.use(router.routes());

mongoose.connect('mongodb://localhost:27017/learn_mongo', function (err) {
  if (err) {
    console.log(err, "数据库连接失败");
    return;
  }
  console.log('数据库连接成功');
});

// 解析上下文里 node 原生请求的 post 参数;
function parsePostData(ctx) {
  return new Promise((resolve, reject) => {
    try {
      let postdata = '';
      ctx.req.addListener('data', data => {
        postdata += data;
      });
      ctx.req.addListener('end', () => {
        let parseData = parseQueryString(postdata);
        resolve(parseData);
      })
    } catch (err) {
      reject(err);
    }
  })
}

// 将 post 请求参数字符串解析成 json;
function parseQueryString(queryStr) {
  let queryData = {};
  let queryStrList = queryStr.split('&');
  console.log(queryStrList);
  for (let [index, queryStr] of queryStrList.entries()) {
    let itemList = queryStr.split('=');
    queryData[itemList[0]] = decodeURIComponent(itemList[1]);
  }
  return queryData;
}

// create data model;
const Schema = mongoose.Schema;
const data = new Schema({
  name: String,
  info: String,
  isHappy: Boolean,
  value: Number,
  Date: String,
});

// instance model;
const Data = mongoose.model('learn_mongo', data);

Data.create({
  info: 'yayaya',
  isHappy: true,
  value: 10000,
  Date: new Date().toLocaleTimeString(),
});

// app.use(async ctx => {
  // if (ctx.url === '/test' && ctx.method === 'POST') {
    // 当 post 请求时，解析 post 表单里的数据并显示出来;
    // let postData = await parsePostData(ctx);
    // ctx.body = postData;

    // 当 post 请求时，中间件 koa-bodyparser 解析 post 表单里的数据，并显示出来;
    // let postData = ctx.request.body;
    // ctx.body = postData;
  // }
// })



router.post('/test_post', async ctx => {
  const { name, value } = ctx.request.body;
  await Data.create({
    name,
    value,
    Date: new Date().toLocaleTimeString(),
  });
  const lists = await Data.find();
  ctx.body = lists;
})

function getSyncTime() {
  return new Promise((resolve, reject) => {
    try {
      let startTime = new Date().getTime();
      setTimeout(() => {
        let endTime = new Date().getTime();
        let data = endTime - startTime;
        resolve(data);
      }, 1000);
    } catch (err) {
      reject(err);
    }
  })
}

async function getSyncData() {
  let time = await getSyncTime();
  let data = `endTime - startTime = ${time}ms`;
  return data;
}

async function getData() {
  let data = await getSyncData();
  console.log(data);
}

getData();

// 路由1;
router.get('/', async ctx => {
  const lists = await Data.find();
  ctx.response.body = lists;
})

// 路由2;
router.get('/404', async (ctx) => {
  ctx.body = '404 page!';
}).get('/hello/:name', async (ctx) => {
  const name = ctx.params.name;
  ctx.response.body = `<h1>Hello ${name}</h1>`;
});

// app.use(router.routes());

// logger;
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log((`${ctx.method} ${ctx.url} - ${rt}`));
});

// x-response-time;
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.listen(3000, () => {
  console.log('app listening at port 3000');
});