/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CfnOutput, SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import {
  AnyPrincipal,
  CfnServiceLinkedRole,
  Effect,
  PolicyStatement,
} from 'aws-cdk-lib/aws-iam';
import { Domain, EngineVersion } from 'aws-cdk-lib/aws-opensearchservice';
import type { Construct } from 'constructs';

import { EnvContextSchema, StageContextSchema } from '../shared/context-types';

export interface AppStackProps extends StackProps {
  password: string;
}

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    const stage = StageContextSchema.parse(this.node.tryGetContext('stage'));
    const context = EnvContextSchema.parse(this.node.tryGetContext(stage));

    // const vpc = Vpc.fromLookup(this, 'vpc-lookup', { vpcName: '-' });

    // const opensearchSecurityGroup = new SecurityGroup(this, 'opensearch-sg', {
    //   vpc,
    //   allowAllOutbound: true,
    // });

    new CfnServiceLinkedRole(this, 'elastic-service-linked-role', {
      awsServiceName: 'es.amazonaws.com',
    });

    // const peerSecurityGroups: SecurityGroup[] = [];
    // peerSecurityGroups.forEach((sg: SecurityGroup) => {
    //   opensearchSecurityGroup.addIngressRule(
    //     Peer.securityGroupId(sg.securityGroupId),
    //     Port.allTcp(),
    //   );
    // });

    const osDomain = new Domain(
      this,
      `opensearch-domain-${context.service.environment.name}`,
      {
        version: EngineVersion.OPENSEARCH_1_2,
        // vpc,
        // vpcSubnets: [
        //   {
        //     subnetFilters: [SubnetFilter.byIds([context.service.subnetId])],
        //   },
        // ],
        // securityGroups: [opensearchSecurityGroup],
        ebs: {
          volumeSize: 10,
        },
        capacity: {
          dataNodes: 1,
          dataNodeInstanceType: 't3.small.search',
        },
        fineGrainedAccessControl: {
          masterUserPassword: new SecretValue(props.password),
        },
        useUnsignedBasicAuth: true,
        accessPolicies: [
          new PolicyStatement({
            actions: ['es:*'],
            principals: [new AnyPrincipal()],
            effect: Effect.ALLOW,
            resources: ['*'],
          }),
        ],
      },
    );

    new CfnOutput(this, 'opensearchEndpoint', {
      value: `https://${osDomain.domainEndpoint}`,
    });
  }
}
