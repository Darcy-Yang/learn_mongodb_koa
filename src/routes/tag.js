import { request, summary, tagsAll, path, body, } from 'koa-swagger-decorator'
import { Tag } from '../models'

const tagSchema = {
  name: { type: 'string', required: true },
  color: { type: 'string', required: false, default: '#3da8f5' },
}

@tagsAll(['Tag'])

export default class TagRouter {
  @request('GET', '/tags')
  @summary('get all tags')

  static async getTags(ctx) {
    try {
      const allTags = await Tag.find()

      ctx.body = { allTags }
    } catch (err) {
      throw Error(err && err.message)
    }
  }

  @request('POST', '/tag')
  @body(tagSchema)
  @summary('add a tag')

  static async addTag(ctx) {
    try {
      const { name, color } = ctx.validatedBody
      if (!name) throw Error('tag name is required!')

      const hasOne = await Tag.findOne({ name })
      if (hasOne) throw Error('tag name is exist!')

      const date = new Date().getTime()
      await Tag.create({ name, color, created: date, updated: date })

      ctx.body = { success: 1 }
    } catch (err) {
      throw Error(err && err.message)
    }
  }

  @request('POST', '/tag/{_id}')
  @path({ _id: { type: 'string', reuqired: true } })
  @body(tagSchema)
  @summary('update a tag')

  static async updateTag(ctx) {
    try {
      const { _id } = ctx.validatedParams
      const { name, color } = ctx.validatedBody

      const target = await Tag.findById(_id)
      if (!target) throw Error('tag not exist!')

      const date = new Date().getTime()
      await Tag.findOneAndUpdate({ _id }, { name, color, updated: date })

      ctx.body = { success: 1 }
    } catch (err) {
      throw Error(err && err.message)
    }
  }

  @request('DELETE', '/tag/{_id}')
  @path({ _id: { type: 'string', required: true } })
  @summary('delete a tag')

  static async deleteTag(ctx) {
    try {
      const { _id } = ctx.validatedParams
      await Tag.deleteOne({ _id })

      ctx.body = { success: 1 }
    } catch (err) {
      throw Error(err && err.message)
    }
  }
}
