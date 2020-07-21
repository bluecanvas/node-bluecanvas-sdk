export type Maybe<T> = T | null;

export enum DeploymentType {
  STORY = 'STORY',
  CHECKLIST = 'CHECKLIST',
  RELEASE = 'RELEASE'
}

/**
 * The deploy request's state provides a high-level indication of activity.
 * The granularity should be suitable list views or page headers. More specific
 * detail can be found in operations and their metadata.
 */
export enum DeploymentState {
  WORKING = 'WORKING',
  READY = 'READY',
  PROBLEM = 'PROBLEM',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DEPLOYED = 'DEPLOYED'
}

/**
 * Phases describe the progressive steps of a deploy request. An earlier
 * phase must succeed for the run to progress to the next phase.
 */
export enum DeploymentPhase {
  DRAFT = 'DRAFT',
  NEW = 'NEW',
  PLAN = 'PLAN',
  ADVICE = 'ADVICE',
  CONFLICT = 'CONFLICT',
  VALIDATE = 'VALIDATE',
  APPLY = 'APPLY',
  RECONCILE = 'RECONCILE',
  CHECKLIST = 'CHECKLIST',
  DONE = 'DONE'
}

/**
 * Test levels, as understood by the Metadata API [deploy()][1] method. If you
 * don’t specify a test level, the [default behavior][2] for test execution is
 * used.
 *
 * [1]:https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_deploy.htm
 * [2]:https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_deploy_running_tests.htm
 */
export enum TestLevel {
  RUN_DEFAULT = 'RUN_DEFAULT',
  NO_TEST_RUN = 'NO_TEST_RUN',
  RUN_SPECIFIED_TESTS = 'RUN_SPECIFIED_TESTS',
  RUN_LOCAL_TESTS = 'RUN_LOCAL_TESTS',
  RUN_ALL_TESTS_IN_ORG = 'RUN_ALL_TESTS_IN_ORG'
}

export enum CheckState {
  QUEUED = 'QUEUED',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export enum CheckResult {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  NEUTRAL = 'NEUTRAL',
  CANCELLED = 'CANCELLED',
  SKIPPED = 'SKIPPED',
  TIMED_OUT = 'TIMED_OUT'
}

export interface DeploymentCheck {
  state: CheckState;
  result?: Maybe<CheckResult>;
  description?: Maybe<string>;
  externalUrl?: Maybe<string>;
  externalId?: Maybe<string>;
}

