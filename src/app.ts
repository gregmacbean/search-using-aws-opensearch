import createLogger from '@seek/logger';
import { SQSEvent, SQSHandler } from 'aws-lambda';

const logger = createLogger({
  name: 'my-service',
});

export const handler: SQSHandler = (_: SQSEvent) => {
  logger.info('Hello World!');
};
