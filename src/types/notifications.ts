import {
  CheckResult,
  CheckState,
  DeploymentPhase,
  DeploymentState,
  DeploymentType,
  Maybe,
  TestLevel,
} from "./schema";

interface Branch {
  tenantId: string;
  name: string;
  commitHead: string;
}

interface Author {
  email: string;
}

interface Review {
  author: Author;
  approval_state: string;
  comment: string | null;
}

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
  creator: Author;
  reviews: Review[];
}

interface Validation {
  state: CheckState;
  result?: Maybe<CheckResult>;
  externalUrl?: Maybe<string>;
  externalId?: Maybe<string>;
}

export interface BranchCommittedNotification {
  Type: "Notification";
  Event: "branches/committed";
  Branch: Branch;
}

export interface DeploymentsCreatedNotification {
  Type: "Notification";
  Event: "deployments/created";
  Deployment: Deployment;
}

export interface DeploymentsReviewedNotification {
  Type: "Notification";
  Event: "deployments/reviewed";
  Deployment: Deployment;
  Review: Review;
}

export interface DeploymentsValidatingNotification {
  Type: "Notification";
  Event: "deployments/validating";
  Deployment: Deployment;
}

export interface DeploymentsValidatedNotification {
  Type: "Notification";
  Event: "deployments/validated";
  Deployment: Deployment;
  Validation: Validation;
}

export interface DeploymentsDeployedNotification {
  Type: "Notification";
  Event: "deployments/deployed";
  Deployment: Deployment;
}

export type NotificationMessage =
  | BranchCommittedNotification
  | DeploymentsCreatedNotification
  | DeploymentsReviewedNotification
  | DeploymentsValidatingNotification
  | DeploymentsValidatedNotification
  | DeploymentsDeployedNotification;
