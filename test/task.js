import { expect } from 'chai';
import sinon from 'sinon';
import Task from '../src/task';

describe('Task', () => {
  let registry;
  let task;
  let producer;
  beforeEach(() => {
    producer = {
      send: sinon.stub().returns(Promise.resolve()),
      initialize: sinon.stub.returns(Promise.resolve()),
    };
    registry = {
      addNewTask: sinon.stub(),
      removeTask: sinon.stub(),
    };
    task = Task({}, registry, producer, console);
  });

  it('should create a new task instance', () => {
    expect(typeof task).to.equal('object');
    expect(typeof task.define).to.equal('function');
    expect(typeof task.publish).to.equal('function');
    expect(typeof task.subscribe).to.equal('function');
  });

  it('should be able to define new task', () => {
    task.define('a-simple-task', () => {});
    expect(registry.addNewTask.callCount).to.equal(1);
  });

  it('should be able to publish', async () => {
    task.define('a-simple-task', () => {});
    const cbStub = sinon.stub();
    task.events.on('success', cbStub);
    await task.publish({ payload: 'something-big' });
    expect(producer.send.callCount).to.equal(1);
    expect(cbStub.callCount).to.equal(1);
  });

  it('should be able to publish with callback on failure', async () => {
    const failureProducer = {
      send: sinon.stub().returns(Promise.reject()),
      initialize: sinon.stub.returns(Promise.resolve()),
    };
    const failTask = Task({}, registry, failureProducer, console);
    failTask.define('a-simple-task', () => {});
    const cbStub = sinon.stub();
    failTask.events.on('failure', cbStub);
    let err = false;
    try {
      await failTask.publish({ payload: 'something-big' });
    } catch (ex) {
      expect(failureProducer.send.callCount).to.equal(1);
      expect(cbStub.callCount).to.equal(1);
      err = true;
    }
    expect(err).to.equal(true);
  });

  it('should be have subscribe method to invoke', () => {
    const subscribeStub = sinon.stub();
    task.define('a-simple-task', subscribeStub);
    task.subscribe({ payload: 'something-small' });
    expect(subscribeStub.callCount).to.equal(1);
  });

  it('should create attach env to topic name', () => {
    const name = task.getTopicName('a-simple-task');
    task.events.on('create', (topic) => {
      expect(topic).to.equal(`${process.env.NODE_ENV}_a-simple-task`.toUpperCase());
    });
    task.define(name, () => {});
  });

  it('should create attach env to topic name', () => {
    delete process.env.NODE_ENV;
    const name = task.getTopicName('a-simple-task');
    task.events.on('create', (topic) => {
      expect(topic).to.equal('DEVELOPMENT_A-SIMPLE-TASK');
    });
    task.define(name, () => {});
  });
});
