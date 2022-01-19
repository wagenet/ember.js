import { precompile } from '@glimmer/compiler';
import { Option } from '@glimmer/interfaces';
import { AST, ASTPlugin } from '@glimmer/syntax';
import { AbstractTestCase } from 'internal-test-helpers';
import { compileOptions } from '../../index';

export default class extends AbstractTestCase {
  assertTransformed(before: string, after: string): void {
    this.assert.deepEqual(deloc(ast(before)), deloc(ast(after)));
  }
}

function ast(template: string): AST.Program {
  let program: Option<AST.Program> = null;

  function extractProgram(): ASTPlugin {
    return {
      name: 'extract-program',

      visitor: {
        Program: {
          exit(node: AST.Program): void {
            program = clone(node);
          },
        },
      },
    };
  }

  const options = compileOptions({
    moduleName: '-top-level',
  });

  if (options.plugins?.ast) {
    options.plugins.ast.push(extractProgram);
  }

  precompile(template, options as any);

  return program!;
}

function clone<T extends object>(node: T): T {
  const out = Object.create(null);
  const keys = Object.keys(node);

  keys.forEach((key) => {
    const value = node[key];

    if (value !== null && typeof value === 'object') {
      out[key] = clone(value);
    } else {
      out[key] = value;
    }
  });

  return out;
}

function deloc<T extends object, U extends { loc?: AST.SourceLocation }>(node: T & U): T {
  const out = Object.create(null);
  const keys = Object.keys(node);

  keys.forEach((key) => {
    const value = node[key];

    if (key === 'loc') {
      return;
    } else if (value !== null && typeof value === 'object') {
      out[key] = deloc(value);
    } else {
      out[key] = value;
    }
  });

  return out;
}
