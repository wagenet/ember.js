import { Container } from '@ember/-internals/container';

const { _leakTracking: containerLeakTracking } = Container;

export function setupContainersCheck(hooks: NestedHooks): void {
  hooks.afterEach(function () {
    if (containerLeakTracking === undefined) return;

    const { config } = QUnit;

    const {
      testName,
      testId,
      module: { name: moduleName },
    } = config.current;
    let { finish: originalFinish } = config.current;

    config.current.finish = function () {
      originalFinish.call(this);
      originalFinish = undefined;

      (config as any).queue.unshift(function () {
        if (containerLeakTracking.hasContainers()) {
          containerLeakTracking.reset();
          // eslint-disable-next-line no-console
          console.assert(
            false,
            `Leaked container after test ${moduleName}: ${testName} testId=${testId}`
          );
        }
      });
    };
  });
}
