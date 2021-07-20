import { NodeRenderer } from '../index'
import { Asset } from '../contentful-data-types'
import { prependUrlProtocol } from '../helpers'

export const renderBlockEmbeddedAsset: NodeRenderer = (node, { options }) => {
  const asset = node.data.target as Asset

  let url = options.prependUrlProtocol ? prependUrlProtocol(asset.fields.file.url) : asset.fields.file.url

  return `\n\n![${asset.fields.title}](${url})\n\n`
}
