/* eslint-disable no-console */

const path = require('path');
const { rollup } = require('rollup');
const { default: dts } = require('rollup-plugin-dts');
const { exit } = require('process');
const { mkdir, readFile } = require('fs/promises');
const glob = require('glob');

async function rollupTypes(inPath, outPath) {
  try {
    let bundle = await rollup({
      input: path.format({
        dir: inPath.dir,
        name: inPath.name,
        ext: '.ts',
      }),
      plugins: [
        dts({
          compilerOptions: {
            // Unless explicit, we don't want anything other than relative imports to be picked up
            baseUrl: null,
          },
        }),
      ],
    });

    let outFile = path.format({
      dir: `dist/types/${outPath.dir}`,
      name: outPath.name,
      ext: '.ts',
    });

    // console.log({ outFile });

    return bundle.write({
      output: {
        file: outFile,
        format: 'es',
      },
    });
  } catch (e) {
    console.error('ROLLUP ERROR', e);
    exit(1);
  }
}

async function run() {
  await mkdir('dist/types', { recursive: true });

  let packagesPath = path.join(__dirname, 'dist', 'packages');
  let files = glob.sync(path.join(packagesPath, '@ember', '**', 'package.json'));

  for (let file of files) {
    let data = await readFile(file);
    let json = JSON.parse(data);
    let pkgExports = json.exports ?? { '.': './index.js' };

    // console.log({ pkgExports });

    for (let exportPath of Object.values(pkgExports)) {
      let filePath = path.join(path.dirname(file), exportPath).replace(/\.js$/, '.d.ts');
      let relativeOutPath = path.relative(packagesPath, filePath);
      let outPath = path.parse(relativeOutPath);

      // console.log({ rollup: filePath });

      await rollupTypes(path.parse(filePath), outPath);
    }
  }
}

run();
