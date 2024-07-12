export class CredentialResponse {
  constructor(
    public clientId: string,
    public client_id: string,
    public credential: string,
    public select_by: string
  ) {
  }
}

export interface  LoginResponse {
  success: boolean;
  message: string;
  pictureUrl: string;
  name: string;
  email: string;
  userId: string;
}
