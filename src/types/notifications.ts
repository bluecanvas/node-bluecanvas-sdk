import { Branch, Deployment, Review, Validation } from "./schema";

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
