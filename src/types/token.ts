export interface TokenResponse {
  access_token: string;
  endpoints: {
    frontend: string;
    backend: string;
  };
  expires_in: number;
  tenant_id: string;
  token_type: 'Bearer';
}
