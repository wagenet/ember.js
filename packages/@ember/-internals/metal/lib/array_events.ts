import { peekMeta } from '@ember/-internals/meta';
import { sendEvent } from './events';
import { notifyPropertyChange } from './property_events';

export function arrayContentWillChange<T extends object>(
  array: T,
  startIdx: number,
  removeAmt: number,
  addAmt: number
): T {
  // if no args are passed assume everything changes
  if (startIdx === undefined) {
    startIdx = 0;
    removeAmt = addAmt = -1;
  } else {
    if (removeAmt === undefined) {
      removeAmt = -1;
    }

    if (addAmt === undefined) {
      addAmt = -1;
    }
  }

  sendEvent(array, '@array:before', [array, startIdx, removeAmt, addAmt]);

  return array;
}

export function arrayContentDidChange<T extends { length: number }>(
  array: T,
  startIdx: number,
  removeAmt: number,
  addAmt: number,
  notify = true
): T {
  // if no args are passed assume everything changes
  if (startIdx === undefined) {
    startIdx = 0;
    removeAmt = addAmt = -1;
  } else {
    if (removeAmt === undefined) {
      removeAmt = -1;
    }

    if (addAmt === undefined) {
      addAmt = -1;
    }
  }

  const meta = peekMeta(array);

  if (notify) {
    if (addAmt < 0 || removeAmt < 0 || addAmt - removeAmt !== 0) {
      notifyPropertyChange(array, 'length', meta);
    }

    notifyPropertyChange(array, '[]', meta);
  }

  sendEvent(array, '@array:change', [array, startIdx, removeAmt, addAmt]);

  if (meta !== null) {
    const length = array.length;
    const addedAmount = addAmt === -1 ? 0 : addAmt;
    const removedAmount = removeAmt === -1 ? 0 : removeAmt;
    const delta = addedAmount - removedAmount;
    const previousLength = length - delta;

    const normalStartIdx = startIdx < 0 ? previousLength + startIdx : startIdx;
    if (meta.revisionFor('firstObject') !== undefined && normalStartIdx === 0) {
      notifyPropertyChange(array, 'firstObject', meta);
    }

    if (meta.revisionFor('lastObject') !== undefined) {
      const previousLastIndex = previousLength - 1;
      const lastAffectedIndex = normalStartIdx + removedAmount;
      if (previousLastIndex < lastAffectedIndex) {
        notifyPropertyChange(array, 'lastObject', meta);
      }
    }
  }

  return array;
}
