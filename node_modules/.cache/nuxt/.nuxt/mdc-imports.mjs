import _RemarkEmoji from 'remark-emoji'
import _RemarkMdc from 'remark-mdc'
import _Highlight from '/Users/dailyup/Documents/projects/auth_provider_docs_2/node_modules/@nuxtjs/mdc/dist/runtime/highlighter/rehype-nuxt.js'

export const remarkPlugins = {
  'remark-emoji': { instance: _RemarkEmoji },
  'remark-mdc': { instance: _RemarkMdc, options: {"autoUnwrap":true} },
}

export const rehypePlugins = {
  'highlight': { instance: _Highlight, options: {} },
}

export const highlight = {"theme":{"light":"material-theme-lighter","default":"material-theme","dark":"material-theme-palenight"}}