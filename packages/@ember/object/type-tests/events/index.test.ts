import { addListener, removeListener, sendEvent } from '@ember/object/events';

import EmberObject from '@ember/object';
import { on } from '@ember/object/evented';

class Job extends EmberObject {
  logStartOrUpdate = on('started', 'updated', () => {
    // eslint-disable-next-line no-console
    console.log('Job updated!');
  });

  logCompleted = on('completed', () => {
    // eslint-disable-next-line no-console
    console.log('Job completed!');
  });
}

const job = Job.create();

sendEvent(job, 'started'); // Logs 'Job started!'
sendEvent(job, 'updated'); // Logs 'Job updated!'
sendEvent(job, 'completed'); // Logs 'Job completed!'

class MyClass extends EmberObject {
  constructor() {
    super();
    addListener(this, 'willDestroy', this, 'willDestroyListener');
    addListener(this, 'willDestroy', this, 'willDestroyListener', true);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    addListener(this, 'willDestroy', this, this.willDestroyListener);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    addListener(this, 'willDestroy', this, this.willDestroyListener, true);
    removeListener(this, 'willDestroy', this, 'willDestroyListener');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    removeListener(this, 'willDestroy', this, this.willDestroyListener);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  willDestroyListener() {}
}

MyClass.create();
