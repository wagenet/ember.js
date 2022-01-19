import require, { has } from 'require';
import bootstrap from './bootstrap';

// Globals mode template compiler
if (
  has('@ember/application') &&
  has('@ember/-internals/browser-environment') &&
  has('@ember/-internals/glimmer')
) {
  const emberEnv = require('@ember/-internals/browser-environment');
  const emberGlimmer = require('@ember/-internals/glimmer');
  const emberApp = require('@ember/application');
  const Application = emberApp.default;
  const { hasTemplate, setTemplate } = emberGlimmer;
  const { hasDOM } = emberEnv;

  Application.initializer({
    name: 'domTemplates',
    initialize() {
      if (hasDOM) {
        bootstrap({ context: document, hasTemplate, setTemplate });
      }
    },
  });
}
