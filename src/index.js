// @flow
import 'babel-polyfill';

import kafka from 'no-kafka';
import NULL_LOGGER from 'null-logger';
import Task from './task';
import Registry from './registry';
import Runner from './runner';
import Admin from './admin';
import Producer from './producer';

import type { Config } from '../types';

const Steveo = (config: Config, logger: Object = NULL_LOGGER) => {
  const registry = Registry(config.publishCallback);
  const task = () => {
    const producer = Producer(config, logger);
    return Task(config, registry, producer);
  };

  return {
    task,
    lag: Admin(config).lag,
    runner: Runner(config, registry, logger),
  };
};

export const kafkaCompression = {
  SNAPPY: kafka.COMPRESSION_SNAPPY,
  GZIP: kafka.COMPRESSION_GZIP,
  NONE: kafka.COMPRESSION_NONE,
};
export default Steveo;
