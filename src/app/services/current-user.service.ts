import {Injectable} from '@angular/core';
import {BehaviorSubject, first, Observable} from "rxjs";
import {Router} from "@angular/router";
import {CredentialResponse, LoginResponse} from "../model/model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private readonly url = environment.warlords_backend_url + '/user';
  private currentUser: CurrentUser | undefined;
  private _currentUser$ = new BehaviorSubject<CurrentUser | undefined>(undefined);

  constructor(private router: Router, private http: HttpClient) {}

  get currentUser$(): Observable<CurrentUser | undefined> {
    return this._currentUser$;
  }

  setCurrentUser(credentialResponse?: CredentialResponse) {
    // https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
    // todo: add credential validation
    // todo: move validation and user login to backend
    // todo: add csrf validation

    if (credentialResponse) {
      this.http
        .post<LoginResponse>(this.url + "/login", credentialResponse)
        .pipe(first())
        .subscribe(loginResponse => {
          console.log('User login server ACK', loginResponse);

          if (loginResponse?.success) {
            this.currentUser = new CurrentUser(loginResponse.userId, loginResponse.name);
            this._currentUser$.next(this.currentUser);
          }
        })
    } else {
      this.currentUser = undefined;
      this._currentUser$.next(this.currentUser)
    }
  }

  getCurrentUser(): CurrentUser | undefined {
    return this.currentUser;
  }
}

export class CurrentUser {
  constructor(
    private _id: string,
    private _name: string
  ) {
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }
}
