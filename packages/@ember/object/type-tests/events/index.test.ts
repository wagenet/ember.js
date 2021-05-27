import { addListener, removeListener, sendEvent } from '@ember/object/events';

import EmberObject from '@ember/object';
import { on } from '@ember/object/evented';

class Job extends EmberObject {
  logStartOrUpdate = on('started', 'updated', () => {
    console.log('Job updated!');
  });

  logCompleted = on('completed', () => {
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
    addListener(this, 'willDestroy', this, this.willDestroyListener);
    addListener(this, 'willDestroy', this, this.willDestroyListener, true);
    removeListener(this, 'willDestroy', this, 'willDestroyListener');
    removeListener(this, 'willDestroy', this, this.willDestroyListener);
  }

  willDestroyListener() {}
}

MyClass.create();
