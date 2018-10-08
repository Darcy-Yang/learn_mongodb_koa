import { request, summary, tags, body } from 'koa-swagger-decorator';
import { User } from '../models';

const tag = tags(['Basic']);

export default class BasicRouter {
  @request('get', '/basic/user')
  @summary('获取用户数据')
  @tag
  static async getUser(ctx) {
    const users = await User.find();
    ctx.body = users;
  }

  @request('post', '/basic/addUser')
  @summary('添加用户')
  @tag
  @body({
    name: { type: 'string', required: true, description: '用户昵称' },
    password: { type: 'string', required: true, description: '用户密码' },
  })
  static async addUser(ctx) {
    const { name, password } = ctx.validatedBody;
    await User.create({
      name,
      password,
    });
    ctx.body = { success: 1 };
  }
}
