import { observer } from '@ember/object';

import { expectTypeOf } from 'expect-type';

const definition = {
  dependentKeys: ['value1', 'value2', 'value3'],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  fn: () => {},
  sync: true,
};

class Foo {
  valueObserver = observer('value', function () {
    // Executes whenever the "value" property changes
  });

  definitionObserver = observer(definition);

  // @ts-expect-error Requires at least one key
  noKeysObserver = observer(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function

  // @ts-expect-error Doesn't allow keys and definition
  extraKeysObserver = observer('extraKey', definition);
}

const foo = new Foo();

expectTypeOf(foo.valueObserver).toEqualTypeOf<() => void>();
expectTypeOf(foo.definitionObserver).toEqualTypeOf<() => void>();
