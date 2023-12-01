import {Injectable} from '@angular/core';
import {BehaviorSubject, first, Observable} from "rxjs";
import {CredentialResponse, CredentialValidationResponse} from "../model/model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private readonly url = environment.warlords_backend_url + '/user';
  private currentUser: CurrentUser | undefined;

  constructor(private http: HttpClient) {
  }

  private _currentUser$ = new BehaviorSubject<CurrentUser | undefined>(undefined);

  get currentUser$(): Observable<CurrentUser | undefined> {
    return this._currentUser$;
  }

  setCurrentUser(credentialResponse?: CredentialResponse) {
    if (credentialResponse) {
      this.http
        .post<CredentialValidationResponse>(this.url + "/login", credentialResponse)
        .pipe(first())
        .subscribe((validationResponse: CredentialValidationResponse) => {
          console.log('User login server ACK', validationResponse);

          if (validationResponse.success) {
            this.currentUser = new CurrentUser("", validationResponse.name, validationResponse.pictureUrl);
            this._currentUser$.next(this.currentUser);
          }
        })
    }
  }

  getCurrentUser(): CurrentUser | undefined {
    return this.currentUser;
  }
}

export class CurrentUser {
  constructor(
    private _id: string,
    private _name: string,
    private _pictureUrl: string
  ) {
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get pictureUrl(): string {
    return this._pictureUrl;
  }
}
