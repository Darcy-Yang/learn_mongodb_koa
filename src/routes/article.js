import { request, summary, path, query, body, tags } from 'koa-swagger-decorator';

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
  html: {
    type: 'string',
    required: true,
  },
};

export default class ArticleRouter {
  @request('GET', '/article/{type}')
  @path({ type: { type: 'string', required: true, description: 'article type' } })
  @summary('get articles')
  @articleTag
  @query({
    searchWord: {
      type: 'string',
      required: false,
      description: 'search for articles from title or content'
    },
    _id: {
      type: 'string',
      required: false,
      description: 'get article with article_id'
    },
  })

  static async getArticle(ctx) {
    const { type } = ctx.validatedParams;
    const { searchWord, _id } = ctx.validatedQuery;
    const reg = new RegExp(searchWord, 'i');
    let articles = [];

    if (_id) {
      articles = await Article.findById(_id);
    } else if (type === 'all') {
      articles = await Article.find({ $or: [{ title: reg }, { content: reg }] });
      // 如果文章内容过长，只截取 Menu 列表能够展示的内容长度
      articles.forEach((article) => {
        article.title = (article.title.length > 35) ? article.title.slice(0, 35) : article.title;
        article.content = (article.content.length > 100) ? article.content.slice(0, 100) : article.content;
      });
    }

    ctx.body = { articles };

  }

  @request('POST', '/article')
  @summary('create article')
  @articleTag
  @body(articleSchema)
  static async createArticle(ctx) {
    const { userId, title, content, html } = ctx.validatedBody;

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
      html,
      createdAt: new Date().toLocaleString(),
    });

    ctx.body = { success: 1 };
  }

  // 更新笔记
  @request('POST', '/article/{id}')
  @path({
    id: { type: 'string', required: true }
  })
  @body({
    content: { type: 'string', required: true },
    html: { type: 'string', required: true }
  })
  @summary('update note')
  @articleTag
  static async updateNote(ctx) {
    const { id } = ctx.validatedParams
    const { content, html } = ctx.validatedBody

    if (!id || !content) return

    await Article.findByIdAndUpdate(id, { content, html })

    ctx.body = { success: 1 }
  }

  @request('POST', '/note/tag/{noteId}')
  @path({ noteId: { type: 'string', required: true } })
  @body({ tagInfo: { type: 'object', required: true } })
  @summary('update tags of note')
  @articleTag
  static async updateNoteTags(ctx) {
    try {
      const { noteId } = ctx.validatedParams
      const { tagInfo } = ctx.validatedBody

      await Article.findOneAndUpdate({ _id: noteId }, { tagInfo })

      ctx.body = { success: 1 }
    } catch (err) {
      console.log('err: ', err)
    }
  }
}
