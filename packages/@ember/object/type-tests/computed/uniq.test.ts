import { uniq } from '@ember/object/computed';

class Foo {
  @uniq('foo') declare uniq: unknown[];

  // @ts-expect-error only allows a single key
  @uniq('foo', 'bar') declare uniq2: unknown[];

  // @ts-expect-error it requires a key
  @uniq()
  declare uniq3: unknown[];
}

new Foo();
