import { NodeRenderer } from '../index';

export const createRenderBlockHeading: (level: number) => NodeRenderer = (level) => {
  return (_, { next }) => `\n${'#'.repeat(level)} ${next()}\n`;
};
