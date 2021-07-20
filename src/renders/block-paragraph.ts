import { NodeRenderer } from '../index'

export const renderBlockParagraph: NodeRenderer = (_, { next, parent }) => {
  const childrenContent = next()

  if (!childrenContent.length) return ''
  if (parent) return `\n${childrenContent}\n`

  return `\n\n${childrenContent}\n\n`
}
