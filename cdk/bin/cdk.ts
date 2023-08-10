#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';

import {Bucket, BucketAccessControl} from "aws-cdk-lib/aws-s3";
import {BucketDeployment, Source} from "aws-cdk-lib/aws-s3-deployment";
import {Distribution, OriginAccessIdentity} from "aws-cdk-lib/aws-cloudfront";
import {S3Origin} from "aws-cdk-lib/aws-cloudfront-origins";
import * as path from "path";
import { resolveConstructId } from './config';

const app = new cdk.App();
const stack = new CdkStack(app, 'CdkStack', {

  
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});

const bucket = new Bucket(stack, resolveConstructId('staticfiles'), {
  accessControl: BucketAccessControl.PRIVATE,
});

new BucketDeployment(stack, resolveConstructId('deployment'), {
  destinationBucket: bucket,
  sources: [Source.asset(path.resolve(__dirname, '../../dist'))]
});

const originAccessIdentity = new OriginAccessIdentity(stack, resolveConstructId('OriginAccessIdentity'));
bucket.grantRead(originAccessIdentity);

new Distribution(stack, resolveConstructId('cdn'), {
  defaultRootObject: 'index.html',
  defaultBehavior: {
    origin: new S3Origin(bucket, {originAccessIdentity}),
  },
});
