import { DeploymentCheck } from "./schema";

export interface DeploymentsPutCheckRequest {
  /**
   * The numeric identifier of the Deployment Request for which you are
   * updating the check.
   */
  deploymentNumber: number;

  /**
   * The canonical identifier of the status check, for example
   * `"code-coverage"`.
   */
  name: string;

  /**
   * The properties of the check.
   */
  check: DeploymentCheck;
}

export interface DeploymentsPutCheckResponse {
  /**
   * The properties of the check.
   */
  check: DeploymentCheck;
}

export interface DeploymentsDeleteCheckRequest {
  /**
   * The numeric identifier of the Deployment Request for which you are
   * updating the check.
   */
  deploymentNumber: number;

  /**
   * The canonical identifier of the status check, for example
   * `"code-coverage"`.
   */
  name: string;
}

export interface DeploymentsDeleteCheckResponse {
  /**
   * The properties of the deleted check.
   */
  check: DeploymentCheck;
}

export interface ArchivesGetTarGzipBlobRequest {
  /**
   * The Git revision to archive, see `man gitrevision`.
   */
  revision: string;
}

export interface ArchivesGetTarGzipBlobResponse {
  /**
   * The archive's binary contents.
   */
  blob: Buffer;
}
