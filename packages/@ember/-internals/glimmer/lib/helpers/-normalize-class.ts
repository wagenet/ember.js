import { dasherize } from '@ember/string';
import { CapturedArguments } from '@glimmer/interfaces';
import { createComputeRef, valueForRef } from '@glimmer/reference';
import { internalHelper } from './internal-helper';

export default internalHelper(({ positional }: CapturedArguments) => {
  return createComputeRef(() => {
    const classNameParts = (valueForRef(positional[0]) as string).split('.');
    const className = classNameParts[classNameParts.length - 1];
    const value = valueForRef(positional[1]);

    if (value === true) {
      return dasherize(className);
    } else if (!value && value !== 0) {
      return '';
    } else {
      return String(value);
    }
  });
});
