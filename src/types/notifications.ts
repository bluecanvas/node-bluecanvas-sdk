import {
  CheckResult,
  CheckState,
  DeploymentPhase,
  DeploymentState,
  DeploymentType,
  Maybe,
  TestLevel,
} from "./schema";

interface Deployment {
  tenantId: string;
  deploymentNumber: number;
  type: DeploymentType;
  title: string;
  description?: Maybe<string>;
  phase: DeploymentPhase;
  state: DeploymentState;
  sourceBranchName: string;
  sourceCommit: string;
  targetBranchName: string;
  deploymentBranchName: string;
  testLevel: TestLevel;
  specifiedTests: string[];
  files: string[];
  creator: {
    email: string;
  };
}

interface Validation {
  state: CheckState;
  result?: Maybe<CheckResult>;
  externalUrl?: Maybe<string>;
  externalId?: Maybe<string>;
}

export interface DeploymentsCreatedNotification {
  Type: "Notification";
  Event: "deployments/created";
  Deployment: Deployment;
}

export interface DeploymentsValidatedNotification {
  Type: "Notification";
  Event: "deployments/validated";
  Deployment: Deployment;
  Validation: Validation;
}

export type NotificationMessage =
  | DeploymentsCreatedNotification
  | DeploymentsValidatedNotification;
