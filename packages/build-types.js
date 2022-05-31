/* eslint-disable no-console */

const path = require('path');
const { rollup } = require('rollup');
const { default: dts } = require('rollup-plugin-dts');
const { exit } = require('process');

async function rollupTypes(package) {
  console.log('TYPES', package.absolutePath);

  try {
    let bundle = await rollup({
      input: path.format({
        dir: `${__dirname}/tmp/build-types/${package.outPath.dir}`,
        name: package.outPath.name,
        ext: '.d.ts',
      }),
      plugins: [
        dts({
          compilerOptions: {
            // Unless explicit, we don't want anything other than relative imports to be picked up
            baseUrl: null,
            incremental: true,
            paths: {
              // We want to inline these types
              '@ember/-internals/*': [`${__dirname}/tmp/build-types/@ember/-internals/*`],
            },
          },
        }),
      ],
    });

    return bundle.write({
      output: {
        file: path.format(package.rollup),
        format: 'es',
      },
    });
  } catch (e) {
    console.error('ROLLUP ERROR', e);
    exit(1);
  }
}

rollupTypes();
