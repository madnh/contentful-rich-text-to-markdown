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
} from '@contentful/rich-text-types';
import { Entry } from './contentful-data-types';

import * as renders from './renders';
import * as helpers from './helpers';

export { helpers, renders };
export { Document, BLOCKS, MARKS, INLINES };

export type EntryPlain<T> = Pick<Entry<T>, 'sys' | 'fields'>

export type CommonNode = Text | Block | Inline

export interface RenderNext {
  (nodes?: CommonNode[]): string
}

export type MarkdownResult = {
  contentData?: Record<string, any>
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
  index?: number,
  contentData?: Record<string, any>
  addContentData: (value: any, name: string) => string
  combineContentData: (data: Record<string, any>) => void
}

export interface NodeRenderer {
  (node: Block | Inline, context: RenderContext): string
}

export type RenderEmbeddedModelContext = RenderContext & {
  contentDataPath: string
}

export interface ModelRender {
  (entry: EntryPlain<any>, context: RenderEmbeddedModelContext): string
}

export interface RenderNode {
  [k: string]: NodeRenderer

  fallback: NodeRenderer
}

export type MarkRenderer = (text: string, parent: CommonNode) => string;

export interface RenderMark {
  [k: string]: MarkRenderer
}

export interface RenderModels {
  [k: string]: ModelRender
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

  prependUrlProtocol?: boolean,

  contentDataName?: string

  embeddedEntryRenderNotFound?: 'throw' | 'warn' | 'markdown-log'
}

const defaultOptions = {
  embeddedEntryRenderNotFound: 'throw',
  contentDataName: 'contentData',
  prependUrlProtocol: true,
} as Required<Options>;

export const documentToMarkdown: RichtextDocumentRender = (richTextDocument: Document, options: Partial<Options> = {}): MarkdownResult => {
  if (!richTextDocument || !richTextDocument.content) {
    return {
      content: '',
    };
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
      ...options.renderModels || {},
    },
  };

  const context: RenderContext = {
    addContentData(value: any, name: string): string {
      if (!context.contentData) {
        context.contentData = {};
      }

      context.contentData[name] = value;

      return `${finallyOptions.contentDataName}.${name}`;
    },

    combineContentData(data) {
      Object.entries(data).forEach(([name, value]) => context.addContentData(value, name));
    },

    // @ts-ignore
    next: undefined,

    embedDocument: ((document, embedOptions) => {
      const result = documentToMarkdown(document, { ...finallyOptions, ...embedOptions || {} });
      if (result.contentData) {
        context.combineContentData(result.contentData);
      }
      return result.content;
    }),
    options: finallyOptions,
  };

  let content = renderNodeList(richTextDocument.content, context);
  content = content.replace(/^\n{2,}/gm, '\n');

  if (context.contentData) {
    return {
      contentData: context.contentData,
      content: content,
    };
  }

  return {
    content: content,
  };
};

function renderNodeList(nodes: CommonNode[], context: RenderContext): string {
  return nodes.map<string>((node, index) => renderNode(node, { ...context, index })).join('');
}

function renderNode(node: CommonNode, context: RenderContext): string {
  const { options } = context;

  // Render marks
  if (richTextHelpers.isText(node)) {
    const nodeValue = node.value;

    if (node.marks.length > 0) {
      return node.marks.reduce((value: string, mark: Mark) => {
        const markRender = options.renderMark[mark.type];

        if (!markRender) return value;

        return markRender(value, node);
      }, nodeValue);
    }

    return nodeValue;
  }

  // Render nodes

  const nextNode: RenderNext = (nodes) => renderNodeList(nodes || node.content, { ...context, parent: node });
  const nodeType = node.nodeType;
  if (!nodeType) return '';

  const nodeRenderer = options.renderNode[nodeType] || options.renderNode.fallback;
  if (!nodeRenderer) return '';

  return nodeRenderer(node, { ...context, next: nextNode });
}
