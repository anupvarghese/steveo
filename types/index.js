/* @flow */
export type Callback = (x: any) => any;

export type ProducerPayload = (msg: Object, topic: string) => {
  timestamp: number,
  topic: string,
  message: Object,
}

export type Logger = {
  logLevel: number,
};

export type KafkaParams = {
  kafkaConnection: string,
  kafkaGroupId: string,
  clientId: ?string,
  kafkaCodec: string,
  logger: Logger,
};


export type Configuration = {
  kafkaConnection: string,
  clientId: string,
  kafkaGroupId: string,
  logLevel: number,
  kafkaCodec: number | string,
  kafkaSendAttempts: number,
  kafkaSendDelayMin: number,
  kafkaSendDelayMax: number,
};

export type Task = {
  topic: string,
  subscribe: () => any,
};

export type Producer = {
  send: (topic: string, payload: Object) => any,
  initialize: () => any,
  producer: Object,
};

export type RegistredTopics = {
  [key: ?string]: Task,
};

export type Runner = {
  send: (topic: string, payload: Object) => any,
  receive: (messages: Array<Object>, topic: string, partition: number) => any,
  kafkaClient: Object,
  initializeConsumer: (topics: Array<string>) => any,
  initializeGroupAdmin: () => any,
  initializeProducer: () => any,
};


export type Reg = {
  addNewTask: (task: Task) => any,
  removeTask: (task: Task) => any,
  events: Object,
  getTopics: () => Array<string>,
  getTask: (topic: string) => Task,
};

export type KafkaCompression = {
  SNAPPY: number,
  GZIP: number,
  NONE: number,
};

export type Consumer = {
  init: () => Promise<any>,
  commitOffset: () => Promise<any>,
  receive: () => Promise<any>,
};

