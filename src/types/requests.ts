import { DeploymentCheck } from './schema';

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

export interface ArchivesGetTarGzipBlobRequest {
  /**
   * The Git ref to archive.
   */
  ref: string;
}

export interface ArchivesGetTarGzipBlobResponse {
  /**
   * The archive's binary contents.
   */
  blob: Buffer;
}
