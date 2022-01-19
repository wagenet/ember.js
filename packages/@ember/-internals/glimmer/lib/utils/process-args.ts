import { symbol } from '@ember/-internals/utils';
import { MUTABLE_CELL } from '@ember/-internals/views';
import { CapturedNamedArguments } from '@glimmer/interfaces';
import { isUpdatableRef, updateRef, valueForRef } from '@glimmer/reference';
import { ARGS } from '../component-managers/curly';
import { ACTIONS } from '../helpers/action';

// ComponentArgs takes EvaluatedNamedArgs and converts them into the
// inputs needed by CurlyComponents (attrs and props, with mutable
// cells, etc).
export function processComponentArgs(namedArgs: CapturedNamedArguments) {
  const attrs = Object.create(null);
  const props = Object.create(null);

  props[ARGS] = namedArgs;

  for (const name in namedArgs) {
    const ref = namedArgs[name];
    const value = valueForRef(ref);

    const isAction = typeof value === 'function' && ACTIONS.has(value);

    if (isUpdatableRef(ref) && !isAction) {
      attrs[name] = new MutableCell(ref, value);
    } else {
      attrs[name] = value;
    }

    props[name] = value;
  }

  props.attrs = attrs;

  return props;
}

const REF = symbol('REF');

class MutableCell {
  public value: any;
  constructor(ref: any, value: any) {
    this[MUTABLE_CELL] = true;
    this[REF] = ref;
    this.value = value;
  }

  update(val: any) {
    updateRef(this[REF], val);
  }
}
