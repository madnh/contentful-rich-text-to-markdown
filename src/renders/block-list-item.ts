import { NodeRenderer } from '../index'
import { BLOCKS } from '@contentful/rich-text-types'
import { prependLines } from '../helpers'

export const renderBlockListItem: NodeRenderer = (_, { next, parent, index }) => {
  const isOL = parent?.nodeType === BLOCKS.OL_LIST
  const listChar = isOL ? `${(index || 0) + 1}.` : '-'
  const child = next()

  if (!child) return ''

  const childPadding = prependLines(child, () => `    `).trim()

  return `${listChar} ${childPadding}\n`
}
