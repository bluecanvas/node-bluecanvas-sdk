import { AxiosRequestConfig } from 'axios';
import { tokenCache } from 'axios-token-interceptor';
import { TokenResponse } from './types';

interface Options {
  getToken?: () => TokenResponse | Promise<TokenResponse>;
  token?: TokenResponse;
  header?: string;
  headerFormatter?: (resp: TokenResponse) => string;
  baseURLFormatter?: (resp: TokenResponse) => string;
}

function getToken(options: Options) {
  if (options.token) {
    return Promise.resolve(options.token);
  }
  const token = options.getToken();
  return Promise.resolve(token);
}

/**
 * Sets the Authorization header and Base URL based on the received
 * Blue Canvas token response.
 *
 * @internal
 */
export function tokenProvider(options: Options) {
  const header = options.header || 'Authorization';
  const headerFormatter = options.headerFormatter || function defaultHeaderFormatter(resp) {
    return `Bearer ${resp.access_token}`;
  };
  const baseURLFormatter = options.baseURLFormatter || function defaultBaseURLFormatter(resp) {
    return resp.endpoints.backend;
  };

  return function interceptRequest(config: AxiosRequestConfig) {
    return getToken(options)
      .then((resp) => {
        config.baseURL = baseURLFormatter(resp);
        config.headers[header] = headerFormatter(resp);
        return config;
      });
  };
}

tokenProvider.tokenCache = tokenCache;
