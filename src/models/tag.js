import mongoose from 'mongoose'
const Schema = mongoose.Schema

const TagSchema = new Schema({
  name: { type: String },
  color: { type: String },
  created: { type: Number, description: '创建时间的毫秒数' },
  updated: { type: Number, description: '更新时间的毫秒数' }
})

const Tag = mongoose.model('tag', TagSchema)

export default Tag
