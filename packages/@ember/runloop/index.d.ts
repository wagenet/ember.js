import Backburner, { DeferredActionQueues, Timer } from 'backburner.js';

export const _backburner: Backburner;

export const run: Backburner['run'];
export const schedule: Backburner['schedule'];
export const later: Backburner['later'];
export const join: Backburner['join'];
export const cancel: Backburner['cancel'];
export const scheduleOnce: Backburner['scheduleOnce'];

export function _getCurrentRunLoop(): DeferredActionQueues;

export function once(method: () => void): Timer;
export function once<T, U extends keyof T>(target: T, method: U, ...args: unknown[]): Timer;
export function once<T>(
  target: T,
  method: unknown | ((this: T) => void),
  ...args: unknown[]
): Timer;

export function bind<M extends (...args: unknown[]) => unknown>(method: M): M;
export function bind<
  T,
  A extends unknown[],
  M extends (this: T, ...args: [...A, ...unknown[]]) => unknown
>(
  target: T,
  method: M,
  ...args: unknown[]
): M extends (...args: [...A, ...infer Rest]) => infer Return
  ? (this: T, ...args: Rest) => Return
  : never;
export function bind<T, M extends keyof T, A extends unknown[]>(
  target: T,
  method: M,
  ...args: A
): T[M] extends (this: T, ...args: [...A, ...infer Rest]) => infer Return
  ? (this: T, ...args: Rest) => Return
  : never;
