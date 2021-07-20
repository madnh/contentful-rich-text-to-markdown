import { EntryPlain, NodeRenderer } from '../index'

export const renderInlineEntryHyperlink: NodeRenderer = (node, { next }) => {
  const entry = node.data.target as EntryPlain
  const content = next()

  return `<span data-node-type='${node.nodeType}' data-sys-id='${entry.sys.id}'>${content}</span>`
}
