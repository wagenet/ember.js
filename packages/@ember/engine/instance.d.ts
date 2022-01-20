import { Owner } from '@ember/-internals/owner';

export default interface EngineInstance extends Owner {
  boot(): void;
  destroy(): void;

  /** @internal */
  mountPoint?: string;
  /** @internal */
  routable?: boolean;
}
