import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as AxiosLogger from 'axios-logger';
import * as OAuth from 'axios-oauth-client';
import TokenInterceptor from 'axios-token-interceptor';
import uri from 'uri-tag';

import {
  DeploymentsPutCheckRequest,
  DeploymentsPutCheckResponse
} from './types';

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
  extraHeaders?: { [name: string]: string; }

  // Private /////////////////////////////////////////////////////////////////

  /**
   * Overrides the REST API base URL.
   * @internal
   */
  baseUrl?: string;

  /**
   * Overrides the OAuth 2.0 token URL.
   * @internal
   */
  tokenUrl?: string;

  /**
   * Overrides the OAuth 2.0 audience.
   * @internal
   */
  tokenAudience?: string;

  /**
   * Overrides the OAuth 2.0 scope.
   * @internal
   */
  tokenScope?: string;
}

const defaults: Partial<Options> = {
  baseUrl: 'https://manage.bluecanvas.io/apis/rest/v1',
  tokenUrl: 'https://bluecanvas.auth0.com/oauth/token',
  tokenAudience: 'https://api.bluetesting.io/api/v1/#a',
  tokenScope: 'api:user'
};

export class Client {
  readonly deployments: DeploymentsClient;

  /** @internal */
  private options: Options;
  /** @internal */
  private axios: AxiosInstance;

  /** @internal */
  constructor(options: Options) {
    this.options = Object.assign(defaults, options);
    this.axios = this.createAuthenticatedAxios({
      baseURL: this.options.baseUrl
    });

    this.deployments = new DeploymentsClient(
      this.axios, this.options
    );
  }

  /**
   * Creates an Axios client with default options and logging attached.
   * @internal
   */
  private createAxios(config?: AxiosRequestConfig, disableLogging?: boolean): AxiosInstance {
    const instance = axios.create(config);
    instance.defaults.headers = this.options.extraHeaders || {};
    if (disableLogging) {
      instance.interceptors.request.use(req => req, AxiosLogger.errorLogger);
      instance.interceptors.response.use(req => req, AxiosLogger.errorLogger);
    } else {
      instance.interceptors.request.use(AxiosLogger.requestLogger, AxiosLogger.errorLogger);
      instance.interceptors.response.use(AxiosLogger.responseLogger, AxiosLogger.errorLogger);
    }
    return instance;
  }

  /**
   * Creates an Axios client with default options, logging and OAuth 2.0
   * authenticators attached.
   * @internal
   */
  private createAuthenticatedAxios(config?: AxiosRequestConfig) {
    const instance = this.createAxios(config);
    instance.interceptors.request.use(
      // Wraps axios-token-interceptor with oauth-specific configuration,
      // fetches the token using the desired claim method, and caches
      // until the token expires
      OAuth.interceptor(TokenInterceptor, this.exchangeClientCredentials)
    );
    return instance;
  }

  /**
   * Fetches an access token from Auth0 by using the OAuth 2.0 client
   * credentials flow.
   * @internal
   */
  private exchangeClientCredentials = async (): Promise<object> => {
    if (!this.options.clientId || !this.options.clientSecret) {
      throw new Error('Client configuration invalid: The options clientId, clientSecret are required.');
    }

    const axios = this.createAxios({}, true);
    const url = this.options.tokenUrl;
    const data = {
      grant_type: 'client_credentials',
      client_id: this.options.clientId,
      client_secret: this.options.clientSecret,
      audience: this.options.tokenAudience,
      scope: this.options.tokenScope,
    };

    const resp = await axios.post(url, data);
    return resp.data;
  };
}

class DeploymentsClient {
  /** @internal */
  constructor(
    private axios: AxiosInstance,
    private options: Options
  ) {
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
  async putCheck({ deploymentNumber, name, check }: DeploymentsPutCheckRequest): Promise<DeploymentsPutCheckResponse> {
    const resp = await this.axios.put(uri`deployments/${deploymentNumber}/checks/${name}`, check);
    return resp.data;
  }
}
