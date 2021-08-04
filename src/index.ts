import {
  Block,
  BLOCKS,
  Document,
  helpers as richTextHelpers,
  Inline,
  INLINES,
  Mark,
  MARKS,
  Text,
} from '@contentful/rich-text-types'
import { Entry } from './contentful-data-types'

import * as renders from './renders'
import * as helpers from './helpers'

export { helpers, renders }
export { Document, BLOCKS, MARKS, INLINES }

export type EntryPlain<T = unknown> = Pick<Entry<T>, 'sys' | 'fields'>

export type CommonNode = Text | Block | Inline

export interface RenderNext {
  (nodes?: CommonNode[]): string
}

export type MarkdownResult = {
  contentData?: Record<string, unknown>
  content: string
}
export type RichtextDocumentRender = {
  (document: Document, options?: Partial<Options>): MarkdownResult
}
export type RichtextDocumentRenderEmbedded = {
  (document: Document, options?: Partial<Options>): MarkdownResult['content']
}
export type RenderContext = {
  next: RenderNext
  embedDocument: RichtextDocumentRenderEmbedded
  options: Required<Options>
  parent?: CommonNode
  index?: number
  contentData?: Record<string, unknown>
  addContentData: (value: unknown, name: string) => string
  combineContentData: (data: Record<string, unknown>) => void
}

export interface NodeRenderer {
  (node: Block | Inline, context: RenderContext): string
}

export type RenderEmbeddedModelContext = RenderContext & {
  contentDataPath: string
}

export interface ModelRender<T = unknown> {
  (entry: EntryPlain<T>, context: RenderEmbeddedModelContext): string
}

export interface RenderNode {
  fallback: NodeRenderer

  [k: string]: NodeRenderer
}

export type MarkRenderer = (text: string, parent: CommonNode) => string

export interface RenderMark {
  [k: string]: MarkRenderer
}

export interface RenderModels {
  [k: string]: ModelRender<any>

  fallback: ModelRender<any>
}

export interface ModelValidate {
  (entry: Partial<EntryPlain<any>>): boolean | string
}

export interface OnModelInvalid {
  (entry: Partial<EntryPlain<any>>, reason: string): void
}

export interface Options {
  /**
   * Node renderers
   */
  renderNode?: RenderNode
  /**
   * Mark renderers
   */
  renderMark?: RenderMark

  renderModels?: RenderModels

  prependUrlProtocol?: boolean
  contentDataName?: string
  modelFallbackComponentName?: string
  modelValidate?: ModelValidate
  onModelInvalid?: OnModelInvalid
}

const defaultOnModelOnValid: OnModelInvalid = (entry, reason) => {
  const entryId = entry?.sys?.id || 'unknown'
  const entryType = entry?.sys?.contentType?.sys?.id || 'unknown'
  console.warn(`Entry is invalid: sysId=${entryId} type=${entryType} reason=${reason}`)
}
const defaultOptions = {
  contentDataName: 'contentData',
  prependUrlProtocol: true,
  modelFallbackComponentName: 'RichtextModel',
  onModelInvalid: defaultOnModelOnValid,
} as Required<Options>

export const documentToMarkdown: RichtextDocumentRender = (
  richTextDocument,
  options: Partial<Options> = {}
): MarkdownResult => {
  if (!richTextDocument || !richTextDocument.content) {
    return {
      content: '',
    }
  }

  const finallyOptions: Required<Options> = {
    ...defaultOptions,
    ...options,
    renderNode: {
      ...renders.blocks,
      ...options.renderNode,
    },
    renderMark: {
      ...renders.marks,
      ...options.renderMark,
    },
    renderModels: {
      fallback: renders.modelRenderFallback,
      ...(options.renderModels || {}),
    },
  }

  const context: RenderContext = {
    addContentData(value: unknown, name: string): string {
      if (!context.contentData) {
        context.contentData = {}
      }

      context.contentData[name] = value

      return `${finallyOptions.contentDataName}.${name}`
    },

    combineContentData(data) {
      Object.entries(data).forEach(([name, value]) => context.addContentData(value, name))
    },

    next: () => '',

    embedDocument: (document, embedOptions) => {
      const result = documentToMarkdown(document, { ...finallyOptions, ...(embedOptions || {}) })
      if (result.contentData) {
        context.combineContentData(result.contentData)
      }
      return result.content
    },
    options: finallyOptions,
  }

  let content = renderNodeList(richTextDocument.content, context)
  content = content.replace(/^\n{2,}/gm, '\n')

  if (context.contentData) {
    return {
      contentData: context.contentData,
      content: content,
    }
  }

  return {
    content: content,
  }
}

function renderNodeList(nodes: CommonNode[], context: RenderContext): string {
  return nodes
    .map<string>((node, index) => renderNode(node, { ...context, index }))
    .join('')
}

function renderNode(node: CommonNode, context: RenderContext): string {
  const { options } = context

  // Render marks
  if (richTextHelpers.isText(node)) {
    const nodeValue = node.value

    if (node.marks.length > 0) {
      return node.marks.reduce((value: string, mark: Mark) => {
        const markRender = options.renderMark[mark.type]

        if (!markRender) return value

        return markRender(value, node)
      }, nodeValue)
    }

    return nodeValue
  }

  // Render nodes

  const nextNode: RenderNext = nodes => renderNodeList(nodes || node.content, { ...context, parent: node })
  const nodeType = node.nodeType
  if (!nodeType) return ''

  const nodeRenderer = options.renderNode[nodeType] || options.renderNode.fallback
  if (!nodeRenderer) return ''

  return nodeRenderer(node, { ...context, next: nextNode })
}

export function asModelRender<T = unknown>(fn: ModelRender<T>): ModelRender<T> {
  return fn
}
export { validateEntry } from './validate-entry'
