import {Injectable} from '@angular/core';
import {BehaviorSubject, first, Observable} from "rxjs";
import {Router} from "@angular/router";
import {CredentialResponse} from "../model/model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private readonly url = environment.warlords_backend_url + '/user';
  private currentUser: CurrentUser | undefined;
  private _currentUser$ = new BehaviorSubject<CurrentUser | undefined>(undefined);
  private users = new Map<string, string>();

  constructor(private router: Router, private http: HttpClient) {
    // todo remove this stuff after backend can handle logins
    this.users.set('i7', 'Demo User');
    this.users.set('175594743423-b9pf7sduf4pap78mkehr5okpqvhdrheb.apps.googleusercontent.com', 'Google User')
  }

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
        .post(this.url + "/login", credentialResponse)
        .pipe(first())
        .subscribe(credentialResponse => console.log('User login server ACK', credentialResponse))
    }

    let name = (credentialResponse) ? this.users.get(credentialResponse.clientId) : undefined;
    this.currentUser = (credentialResponse && name) ? new CurrentUser(credentialResponse.clientId, name) : undefined;

    this._currentUser$.next(this.currentUser);
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
