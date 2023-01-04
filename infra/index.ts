import { App } from 'aws-cdk-lib';

import {
  EnvContextSchema,
  GlobalContextSchema,
  StageContextSchema,
} from '../shared/context-types';

import { AppStack } from './appStack';

const app = new App();

const context = GlobalContextSchema.parse(app.node.tryGetContext('global'));
const stage = StageContextSchema.parse(app.node.tryGetContext('stage'));
const stageContext = EnvContextSchema.parse(app.node.tryGetContext(stage));

if (!process.env.PASSWORD) {
  throw new Error('Missing password ENV variable');
}

// eslint-disable-next-line no-new
new AppStack(app, 'appStack', {
  stackName: context.appName,
  env: {
    account: stageContext.account,
    region: context.region,
  },
  password: process.env.PASSWORD,
});
