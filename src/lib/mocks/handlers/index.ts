import { articleHandlers } from './articles';
import { entityHandlers } from './entities';

export const handlers = [...articleHandlers, ...entityHandlers];
