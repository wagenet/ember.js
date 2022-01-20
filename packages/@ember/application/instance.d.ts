import { EngineInstanceOptions, Factory, LookupOptions } from '@ember/-internals/owner';
import { EngineInstance } from '@ember/engine';

export class BootOptions {
  isBrowser: boolean;
  shouldRender: boolean;
  document: Document | null;
  rootElement: string | Element | null;
  location: string | null;

  constructor(options?: {
    isBrowser?: boolean;
    shouldRender?: boolean;
    document?: Document;
    rootElement?: string | Element;
    location?: string;
    isInteractive?: boolean;
  });

  toEnvironment(): Record<string, unknown>;
}

export default class ApplicationInstance implements EngineInstance {
  lookup<T>(fullName: string, options?: LookupOptions): T | undefined;
  factoryFor<T, C>(fullName: string, options?: LookupOptions): Factory<T, C> | undefined;
  register<T, C>(fullName: string, factory: Factory<T, C>, options?: object): void;
  hasRegistration(name: string, options?: LookupOptions): boolean;
  boot(): void;
  destroy(): void;

  /** @internal */
  buildChildEngineInstance(name: string, options?: EngineInstanceOptions): EngineInstance;
  /** @internal */
  mountPoint?: string;
  /** @internal */
  routable?: boolean;
}
