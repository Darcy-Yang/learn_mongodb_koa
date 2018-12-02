import { request, summary, query, body, tags } from 'koa-swagger-decorator';

import { User } from '../models';

const userTag = tags(['User']);

const userSchema = {
  name: {
    type: 'string',
    required: true,
  },
  password: {
    type: 'string',
    required: true,
  },
};

export default class UserRouter {
  // TODO: 增加 exception class;
  @request('GET', '/user')
  @summary('get user list')
  @userTag
  @query({
    name: {
      type: 'string',
      required: false,
      description: 'search with user name'
    }
  })

  static async getUser(ctx) {
    const { name } = ctx.validatedQuery;
    let users = null;

    const reg = new RegExp(name, 'i');

    users = await User.find({ name: reg });
    ctx.body = { users };
  }

  @request('POST', '/user')
  @summary('create account')
  @userTag
  @body(userSchema)
  static async createUser(ctx) {
    const { name, password } = ctx.validatedBody;

    if (!name) {
      throw new Error('name is required!');
    } else if (!password) {
      throw new Error('password is required!');
    }
    const currentUser = await User.find({ name });
    if (currentUser.length) throw new Error('该昵称已存在～');

    /**
     * TODO: 存储的 Date 为本地格式;
             存储密码加密;
     */
    await User.create({ name, password, createdAt: new Date().toLocaleString() });

    ctx.body = { success: 1 };
  }

  @request('POST', '/login')
  @summary('login')
  @userTag
  @body(userSchema)
  static async login(ctx) {
    const { name, password } = ctx.validatedBody;

    if (!name) {
      throw new Error('name is required!');
    } else if (!password) {
      throw new Error('password is required!');
    }

    const user = await User.find({ name, password });

    if (!user.length) throw new Error('该用户不存在');

    ctx.body = { name };
  }
}
