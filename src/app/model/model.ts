export class CredentialResponse {
  constructor(
    public clientId: string,
    public client_id: string,
    public credential: string,
    public select_by: string
  ) {
  }
}
