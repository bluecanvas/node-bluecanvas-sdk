import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import * as AxiosLogger from "axios-logger";
import uri from "uri-tag";

import {
  ArchivesGetTarGzipBlobRequest,
  ArchivesGetTarGzipBlobResponse,
  DeploymentsDeleteCheckRequest,
  DeploymentsDeleteCheckResponse,
  DeploymentsPutCheckRequest,
  DeploymentsPutCheckResponse,
  TokenResponse,
} from "./types";

interface Options {
  /**
   * The client ID, used for OAuth 2.0 client credentials authentication.
   */
  clientId: string;

  /**
   * The client secret, used for OAuth 2.0 client credentials authentication.
   */
  clientSecret: string;

  /**
   * A map of custom HTTP headers to add to each outgoing request.
   */
  extraHeaders?: { [name: string]: string };

  // Private /////////////////////////////////////////////////////////////////

  /**
   * Overrides the OAuth 2.0 token URL.
   * @internal
   */
  tokenUri?: string;

  /**
   * Enables debug logging during development. Do not use this in production
   * because it will all log your credentials.
   * @internal
   */
  debug?: boolean;
}

const defaults: Partial<Options> = {
  tokenUri: "https://accounts.bluecanvas.io/apis/oauth2/v1/token",
};

export class Client {
  readonly archives: ArchivesClient;
  readonly deployments: DeploymentsClient;

  /** @internal */
  private options: Options;

  /** @internal */
  private axios: AxiosInstance;

  constructor(options: Options) {
    this.options = Object.assign({}, defaults, options);
    this.axios = this.createAuthenticatedAxios();
    this.archives = new ArchivesClient(this.axios);
    this.deployments = new DeploymentsClient(this.axios, this.options);
  }

  /**
   * Creates an Axios client with default options and logging attached.
   * @internal
   */
  private createAxios(): AxiosInstance {
    const instance = axios.create();
    for (const [name, value] of Object.entries(
      this.options.extraHeaders || {}
    )) {
      instance.defaults.headers[name] = value;
    }

    if (this.options.debug) {
      instance.interceptors.request.use(
        AxiosLogger.requestLogger,
        AxiosLogger.errorLogger
      );
      instance.interceptors.response.use(
        AxiosLogger.responseLogger,
        AxiosLogger.errorLogger
      );
    } else {
      instance.interceptors.request.use((req) => req, AxiosLogger.errorLogger);
      instance.interceptors.response.use(
        (resp) => resp,
        AxiosLogger.errorLogger
      );
    }
    return instance;
  }

  /**
   * Creates an Axios client with default options, logging and OAuth 2.0
   * authenticators attached.
   * @internal
   */
  private createAuthenticatedAxios() {
    const instance = this.createAxios();

    // Keep a token in memory, by reference
    const store: {
      t: { token: string; expiresAt: number; baseURL: string } | null;
    } = { t: null };
    // Wraps axios-token-interceptor with oauth-specific configuration,
    // fetches the token using the desired claim method, and caches
    // until the token expires
    instance.interceptors.request.use(async (config) => {
      const now = new Date();
      if (store.t === null || store.t.expiresAt < now.getTime()) {
        const resp = await this.exchangeClientCredentials();
        store.t = {
          token: resp.access_token,
          expiresAt: now.getTime() + resp.expires_in * 1000,
          baseURL: resp.endpoints.backend,
        };
      }

      config.baseURL = store.t.baseURL;
      config.headers["Authorization"] = `Bearer ${store.t.token}`;
      return config;
    });
    return instance;
  }

  /**
   * Fetches an access token from Auth0 by using the OAuth 2.0 client
   * credentials flow.
   * @internal
   */
  private exchangeClientCredentials = async (): Promise<TokenResponse> => {
    if (!this.options.clientId || !this.options.clientSecret) {
      throw new Error(
        "Client configuration invalid: The options clientId, clientSecret " +
          "are required."
      );
    }
    const axios = this.createAxios();
    const options: AxiosRequestConfig = {
      method: "POST",
      url: this.options.tokenUri,
      auth: {
        username: this.options.clientId,
        password: this.options.clientSecret,
      },
      params: {
        grant_type: "client_credentials",
      },
    };
    const resp = await axios(options);
    return resp.data;
  };
}

class DeploymentsClient {
  /** @internal */
  private options: Options;

  /** @internal */
  private axios: AxiosInstance;

  /** @internal */
  constructor(axios: AxiosInstance, options: Options) {
    this.axios = axios;
    this.options = options;
  }

  /**
   * Creates or updates the status of a check for a given deployment by its
   * canonical check name. The first time you invoke this action, a new
   * record for the check is created and will appear in the interface.
   * Successive calls to this action update the state of that record. This
   * allows you to update the status of a check as it progresses in your
   * external system.
   *
   * @see https://docs.bluecanvas.io/reference/checks-api#put-checks
   */
  async putCheck({
    deploymentNumber,
    name,
    check,
  }: DeploymentsPutCheckRequest): Promise<DeploymentsPutCheckResponse> {
    const resp = await this.axios.put(
      uri`apis/rest/v1/deployments/${deploymentNumber}/checks/${name}`,
      check
    );
    return resp.data;
  }

  async deleteCheck({
    deploymentNumber,
    name,
  }: DeploymentsDeleteCheckRequest): Promise<DeploymentsDeleteCheckResponse> {
    const resp = await this.axios.delete(
      uri`apis/rest/v1/deployments/${deploymentNumber}/checks/${name}`
    );
    return resp.data;
  }
}

class ArchivesClient {
  /** @internal */
  private axios: AxiosInstance;

  /** @internal */
  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  /**
   * Fetches a repository snapshot for the specified git revision as a gzipped tarball.
   *
   * @see https://docs.bluecanvas.io/reference/checks-api#get-archive
   */
  async getTarGzipBlob({
    revision,
  }: ArchivesGetTarGzipBlobRequest): Promise<ArchivesGetTarGzipBlobResponse> {
    const resp = await this.axios.get(uri`apis/rest/v1/archives/${revision}`, {
      responseType: "arraybuffer",
    });

    return {
      blob: Buffer.from(resp.data, "binary"),
    };
  }
}
