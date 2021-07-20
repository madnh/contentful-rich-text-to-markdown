import { NodeRenderer } from '../index';
import { prependLines } from '../helpers';

export const renderBlockQuote: NodeRenderer = (node, { next }) => {
  let child = next(node.content).trim();
  return prependLines(child, '> ');
};
