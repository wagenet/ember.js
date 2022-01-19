import { peekMeta } from '@ember/-internals/meta';

export function getCachedValueFor(obj: object, key: string): unknown {
  const meta = peekMeta(obj);

  if (meta) {
    return meta.valueFor(key);
  } else {
    return undefined;
  }
}
