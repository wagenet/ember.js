import { get } from '@ember/-internals/metal';
import { assert } from '@ember/debug';
import { dasherize } from '@ember/string';
import { ElementOperations } from '@glimmer/interfaces';
import {
  childRefFor,
  childRefFromParts,
  createComputeRef,
  createPrimitiveRef,
  Reference,
  valueForRef,
} from '@glimmer/reference';
import { Component } from './curly-component-state-bucket';

function referenceForParts(rootRef: Reference<Component>, parts: string[]): Reference {
  const isAttrs = parts[0] === 'attrs';

  // TODO deprecate this
  if (isAttrs) {
    parts.shift();

    if (parts.length === 1) {
      return childRefFor(rootRef, parts[0]);
    }
  }

  return childRefFromParts(rootRef, parts);
}

export function parseAttributeBinding(microsyntax: string): [string, string, boolean] {
  const colonIndex = microsyntax.indexOf(':');

  if (colonIndex === -1) {
    assert(
      'You cannot use class as an attributeBinding, use classNameBindings instead.',
      microsyntax !== 'class'
    );
    return [microsyntax, microsyntax, true];
  } else {
    const prop = microsyntax.substring(0, colonIndex);
    const attribute = microsyntax.substring(colonIndex + 1);

    assert(
      'You cannot use class as an attributeBinding, use classNameBindings instead.',
      attribute !== 'class'
    );

    return [prop, attribute, false];
  }
}

export function installAttributeBinding(
  component: Component,
  rootRef: Reference<Component>,
  parsed: [string, string, boolean],
  operations: ElementOperations
) {
  const [prop, attribute, isSimple] = parsed;

  if (attribute === 'id') {
    let elementId = get(component, prop);
    if (elementId === undefined || elementId === null) {
      elementId = component.elementId;
    }
    const elementIdRef = createPrimitiveRef(elementId);
    operations.setAttribute('id', elementIdRef, true, null);
    return;
  }

  const isPath = prop.indexOf('.') > -1;
  const reference = isPath
    ? referenceForParts(rootRef, prop.split('.'))
    : childRefFor(rootRef, prop);

  assert(
    `Illegal attributeBinding: '${prop}' is not a valid attribute name.`,
    !(isSimple && isPath)
  );

  operations.setAttribute(attribute, reference, false, null);
}

export function createClassNameBindingRef(
  rootRef: Reference<Component>,
  microsyntax: string,
  operations: ElementOperations
) {
  const [prop, truthy, falsy] = microsyntax.split(':');
  const isStatic = prop === '';

  if (isStatic) {
    operations.setAttribute('class', createPrimitiveRef(truthy), true, null);
  } else {
    const isPath = prop.indexOf('.') > -1;
    const parts = isPath ? prop.split('.') : [];
    const value = isPath ? referenceForParts(rootRef, parts) : childRefFor(rootRef, prop);
    let ref;

    if (truthy === undefined) {
      ref = createSimpleClassNameBindingRef(value, isPath ? parts[parts.length - 1] : prop);
    } else {
      ref = createColonClassNameBindingRef(value, truthy, falsy);
    }

    operations.setAttribute('class', ref, false, null);
  }
}

export function createSimpleClassNameBindingRef(inner: Reference, path?: string) {
  let dasherizedPath: string;

  return createComputeRef(() => {
    const value = valueForRef(inner);

    if (value === true) {
      assert(
        'You must pass a path when binding a to a class name using classNameBindings',
        path !== undefined
      );

      return dasherizedPath || (dasherizedPath = dasherize(path));
    } else if (value || value === 0) {
      return String(value);
    } else {
      return null;
    }
  });
}

export function createColonClassNameBindingRef(inner: Reference, truthy: string, falsy: string) {
  return createComputeRef(() => {
    return valueForRef(inner) ? truthy : falsy;
  });
}
