import { request, summary, query, body, tags } from 'koa-swagger-decorator';

import { Article, User } from '../models';

const articleTag = tags(['Article']);

const articleSchema = {
  userId: {
    type: 'string',
    required: true,
  },
  title: {
    type: 'string',
    required: true,
  },
  content: {
    type: 'string',
    required: true,
  },
};

export default class ArticleRouter {
  @request('GET', '/article')
  @summary('get articles')
  @articleTag
  @query({
    searchWord: {
      type: 'string',
      required: false,
      description: 'search for articles from title or content'
    }
  })

  static async getArticle(ctx) {
    const { searchWord } = ctx.validatedQuery;
    const reg = new RegExp(searchWord, 'i');
    let articles = [];

    articles = await Article.find({ $or: [{ title: reg }, { content: reg }] });
    // 如果文章内容过长，只截取 Menu 列表能够展示的内容长度
    articles.forEach((article) => {
      article.title = (article.title.length > 35) ? article.title.slice(0, 35) : article.title;
      article.content = (article.content.length > 56) ? article.content.slice(0, 56) : article.content;
    })

    ctx.body = { articles };

  }

  @request('POST', '/article')
  @summary('create article')
  @articleTag
  @body(articleSchema)
  static async createArticle(ctx) {
    const { userId, title, content } = ctx.validatedBody;

    if (!userId) {
      throw new Error('userId is required!');
    } else if (!title) {
      throw new Error('title is required!');
    } else if (!content) {
      throw new Error('content is required!');
    }

    const user = await User.findById(userId);

    if (!user) throw new Error('user is not existed!');

    await Article.create({
      userId,
      title,
      content,
      createdAt: new Date().toLocaleString(),
    });

    ctx.body = { success: 1 };
  }
}
