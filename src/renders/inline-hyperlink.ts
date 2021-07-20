import { NodeRenderer } from '../index'
import { extractRegExps, prependUrlProtocol } from '../helpers'
import { Asset } from '../contentful-data-types'

function renderLink(rawContent: string, link: string): string {
  const [isMatch, groups] = extractRegExps<'title' | 'content'>(
    [/^\[(?<title>.+)](?<content>.*)$/, /^(?<content>.*)\[(?<title>.+)]$/],
    rawContent
  )

  if (!isMatch) {
    return `[${rawContent}](${link})`
  }

  return `[${groups.content}](${link} "${groups.title}")`
}

export const renderInlineHyperlink: NodeRenderer = (node, { next }) => {
  const rawContent = String(next()).trim()
  const link = node.data.uri

  return renderLink(rawContent, link)
}

export const renderInlineAssetHyperlink: NodeRenderer = (node, { next, options }) => {
  const rawContent = String(next()).trim()
  const asset = node.data.target as Asset
  const link = options.prependUrlProtocol ? prependUrlProtocol(asset.fields.file.url) : asset.fields.file.url

  return renderLink(rawContent, link)
}
