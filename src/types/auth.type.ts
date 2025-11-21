export interface ILoginResponse {
  user: {
    id: number | string;
    email: string;
  };
  access_token: string;
  access_token_expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
}

export interface ISignUpResponse extends ILoginResponse {}
