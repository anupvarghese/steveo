// @flow
import 'babel-polyfill';

import kafka from 'no-kafka';
import NULL_LOGGER from 'null-logger';
import Task from './task';
import Registry from './registry';
import Runner from './runner';
import Admin from './admin';

import type { Config } from '../types';

const Steveo = (config: Config, logger: Object = NULL_LOGGER) => {
  const registeredTopics = {};
  const registry = Registry(registeredTopics, config.publishCallback);
  const task = () => {
    const runner = Runner(config, registeredTopics, logger);
    return Task(registry, runner, logger);
  };

  return {
    task,
    lag: Admin(config).lag,
  };
};

export const kafkaCompression = {
  SNAPPY: kafka.COMPRESSION_SNAPPY,
  GZIP: kafka.COMPRESSION_GZIP,
  NONE: kafka.COMPRESSION_NONE,
};
export default Steveo;
