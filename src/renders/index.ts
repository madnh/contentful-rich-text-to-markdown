import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types'
import { RenderMark, RenderNode } from '../index'

import { renderBlockFallback } from './block-fallback'
import { renderBlockEmbeddedEntry } from './block-embedded-entry'
import { renderBlockEmbeddedAsset } from './block-embedded-asset'
import { renderBlockParagraph } from './block-paragraph'
import { createRenderBlockHeading } from './block-heading'
import { renderBlockUseChild } from './block-use-child'
import { renderBlockListItem } from './block-list-item'
import { renderBlockHr } from './block-hr'
import { renderBlockQuote } from './block-quote'
import { renderInlineAssetHyperlink, renderInlineHyperlink } from './inline-hyperlink'
import { renderInlineEntryHyperlink } from './inline-entry-hyperlink'
import { renderInlineEmbeddedEntry } from './inline-embedded-entry'

import * as Marks from './marks'

export const marks: RenderMark = {
  [MARKS.BOLD]: Marks.renderMarkBold,
  [MARKS.ITALIC]: Marks.renderMarkItalic,
  [MARKS.UNDERLINE]: Marks.renderMarkUnderline,
  [MARKS.CODE]: Marks.renderMarkCode,
}

export const blocks: RenderNode = {
  [BLOCKS.PARAGRAPH]: renderBlockParagraph,
  [BLOCKS.HEADING_1]: createRenderBlockHeading(1),
  [BLOCKS.HEADING_2]: createRenderBlockHeading(2),
  [BLOCKS.HEADING_3]: createRenderBlockHeading(3),
  [BLOCKS.HEADING_4]: createRenderBlockHeading(4),
  [BLOCKS.HEADING_5]: createRenderBlockHeading(5),
  [BLOCKS.HEADING_6]: createRenderBlockHeading(6),
  [BLOCKS.EMBEDDED_ENTRY]: renderBlockEmbeddedEntry,
  [BLOCKS.EMBEDDED_ASSET]: renderBlockEmbeddedAsset,
  [BLOCKS.UL_LIST]: renderBlockUseChild,
  [BLOCKS.OL_LIST]: renderBlockUseChild,
  [BLOCKS.LIST_ITEM]: renderBlockListItem,
  [BLOCKS.QUOTE]: renderBlockQuote,
  [BLOCKS.HR]: renderBlockHr,
  [INLINES.ASSET_HYPERLINK]: renderInlineAssetHyperlink,
  [INLINES.ENTRY_HYPERLINK]: renderInlineEntryHyperlink,
  [INLINES.EMBEDDED_ENTRY]: renderInlineEmbeddedEntry,
  [INLINES.HYPERLINK]: renderInlineHyperlink,
  fallback: renderBlockFallback,
}
