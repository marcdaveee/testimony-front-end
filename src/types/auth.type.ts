export interface ILoginResponse {
  access_token: string;
  user: {
    id: number | string;
    email: string;
  };
}

export interface ISignUpResponse extends ILoginResponse {}
