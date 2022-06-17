export { default as RouterState } from './lib/router_state';
export { default as RoutingService } from './lib/routing-service';
export { deprecateTransitionMethods, prefixRouteNameArg } from './lib/utils';
export {
  default as generateController,
  generateControllerFactory,
} from './lib/generate_controller';
export { default as BucketCache } from './lib/cache';
export { default as DSL, DSLCallback } from './lib/dsl';
export { EngineRouteInfo } from './lib/engines';
export { RouteInfo, RouteInfoWithAttributes } from './lib/route-info';
export { default as controllerFor } from './lib/controller_for';

import type { ControllerQueryParamType } from '@ember/controller';
import type Route from '@ember/routing/route';
import type { ModelFor } from 'router_js';

export type ExpandedControllerQueryParam = {
  as: string | null;
  scope: string;
  type?: ControllerQueryParamType;
};

export type NamedRouteArgs<R extends Route> =
  | [routeNameOrUrl: string, ...modelsAndOptions: [...ModelFor<R>[], RouteOptions]]
  | [routeNameOrUrl: string, ...models: ModelFor<R>[]];

export type UnnamedRouteArgs<R extends Route> =
  | [...modelsAndOptions: [...ModelFor<R>[], RouteOptions]]
  | [...models: ModelFor<R>[]]
  | [options: RouteOptions];

export type RouteArgs<R extends Route> = NamedRouteArgs<R> | UnnamedRouteArgs<R>;

export type RouteOptions = { queryParams: Record<string, unknown> };
