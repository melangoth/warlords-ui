import {Injectable} from '@angular/core';
import {BehaviorSubject, first, Observable} from 'rxjs';
import {CredentialResponse, CredentialValidationResponse} from '../model/model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private readonly url = environment.warlords_backend_url + '/api/user';
  private currentUser: CurrentUser | undefined;
  private currentUserSubject$ = new BehaviorSubject<CurrentUser | undefined>(undefined);

  constructor(private http: HttpClient) {
  }

  get currentUser$(): Observable<CurrentUser | undefined> {
    return this.currentUserSubject$;
  }

  setCurrentUser(credentialResponse?: CredentialResponse) {
    // todo: refactor server side to align with class names and endpoints
    // https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
    if (credentialResponse) {
      this.http
        .post<CredentialValidationResponse>(this.url + '/login', credentialResponse)
        .pipe(first())
        .subscribe((validationResponse: CredentialValidationResponse) => {
          console.log('User login server ACK', validationResponse);

          if (validationResponse?.success) {
            this.currentUser = new CurrentUser(validationResponse.userId, validationResponse.name, validationResponse.pictureUrl);
            this.currentUser.token = credentialResponse.credential;
            this.currentUserSubject$.next(this.currentUser);
          }
        });
    } else {
      this.currentUser = undefined;
      this.currentUserSubject$.next(this.currentUser);
    }
  }

  getCurrentUser(): CurrentUser | undefined {
    return this.currentUser;
  }

  testCors() {
    this.http.get<any>('http://localhost:8088/user/free').subscribe();
  }

  testSafe() {
    this.http.get<any>('http://localhost:8088/user/safe').subscribe();
  }
}

export class CurrentUser {
  private _token: string | undefined;

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

  get token(): string | undefined {
    return this._token;
  }

  set token(token: string) {
    this._token = token;
  }
}
