export type { LablogArticleDefinition } from './lablog-article-types'
export { lablogCoverPublicPath } from './lablog-article-types'

import { lablogArticles01to04 } from './lablog-articles-01-04'
import { lablogArticles05to08 } from './lablog-articles-05-08'
import { lablogArticles09to12 } from './lablog-articles-09-12'

export const LABLOG_ARTICLES = [
  ...lablogArticles01to04,
  ...lablogArticles05to08,
  ...lablogArticles09to12,
] as const
