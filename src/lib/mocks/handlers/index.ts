import { articleHandlers } from './articles';
import { entityHandlers } from './entities';
import { metricsHandlers } from './metrics';

export const handlers = [...articleHandlers, ...entityHandlers, ...metricsHandlers];
