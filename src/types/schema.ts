export type Maybe<T> = T | null;

export type DeploymentType =
  | 'STORY'
  | 'CHECKLIST'
  | 'RELEASE'
;

/**
 * The deploy request's state provides a high-level indication of activity.
 * The granularity should be suitable list views or page headers. More specific
 * detail can be found in operations and their metadata.
 */
export type DeploymentState =
  | 'WORKING'
  | 'READY'
  | 'PROBLEM'
  | 'INTERNAL_ERROR'
  | 'DEPLOYED'
;

/**
 * Phases describe the progressive steps of a deploy request. An earlier
 * phase must succeed for the run to progress to the next phase.
 */
export type DeploymentPhase =
  | 'DRAFT'
  | 'NEW'
  | 'PLAN'
  | 'ADVICE'
  | 'CONFLICT'
  | 'VALIDATE'
  | 'APPLY'
  | 'RECONCILE'
  | 'CHECKLIST'
  | 'DONE'
;

/**
 * Test levels, as understood by the Metadata API [deploy()][1] method. If you
 * don’t specify a test level, the [default behavior][2] for test execution is
 * used.
 *
 * [1]:https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_deploy.htm
 * [2]:https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_deploy_running_tests.htm
 */
export type TestLevel =
  | 'RUN_DEFAULT'
  | 'NO_TEST_RUN'
  | 'RUN_SPECIFIED_TESTS'
  | 'RUN_LOCAL_TESTS'
  | 'RUN_ALL_TESTS_IN_ORG'
;

export type CheckState =
  | 'QUEUED'
  | 'IN_PROGRESS'
  | 'DONE'
;

export type CheckResult =
  | 'SUCCESS'
  | 'FAILURE'
  | 'NEUTRAL'
  |'CANCELLED'
  | 'SKIPPED'
  | 'TIMED_OUT'
;

export interface DeploymentCheck {
  state: CheckState;
  result?: Maybe<CheckResult>;
  description?: Maybe<string>;
  externalUrl?: Maybe<string>;
  externalId?: Maybe<string>;
}
