import { EntryPlain, NodeRenderer } from '../index';

export const renderInlineEmbeddedEntry: NodeRenderer = (node) => {
  const entry = node.data.target as EntryPlain<any>;

  return `<span data-node-type='${node.nodeType}' data-sys-id='${entry.sys.id}'></span>`;
};
