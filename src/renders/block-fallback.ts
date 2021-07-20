import { NodeRenderer } from '../index';

export const renderBlockFallback: NodeRenderer = (node) => {
  return `\n\n<!-- Fallback: type=${node.nodeType} -->\n\n`;
};
