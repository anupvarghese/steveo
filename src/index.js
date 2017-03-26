// @flow
import 'babel-polyfill';

import kafka from 'no-kafka';
import Task from './task';
import Registry from './registry';
import Runner from './runner';
import NULL_LOGGER from 'null-logger';

import type { Env } from '../types';

const Steveo = (env: Env, logger: Object = NULL_LOGGER) => {
  const registeredTopics = {};
  const registry = Registry(registeredTopics);
  const runner = Runner(env, registry, logger);
  return {
    task: Task(registry, runner, logger),
  };
};

export const kafkaCompression = {
  SNAPPY: kafka.COMPRESSION_SNAPPY,
  GZIP: kafka.COMPRESSION_GZIP,
  NONE: kafka.COMPRESSION_NONE,
};
export default Steveo;
