const Koa = require('koa');
const router = require('koa-router');
const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  info: String,
  isHappy: Boolean,
  value: Number,
});

const data = mongoose.model('Data', dataSchema);

// 获取数据库内容;
router.get('/data', funtion (req, res) {
  data.find(null, 'name').then(data => {
    console.log(res);
  }).catch(err => {
    console.log(new Error(err));
  })
});
