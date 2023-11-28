import {Component, EventEmitter, NgZone, OnDestroy, OnInit} from '@angular/core';
import {CurrentUserService} from "../services/current-user.service";
import {environment} from "../../environments/environment";
import {Subscription} from "rxjs";
import {CredentialResponse} from "../model/model";

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.scss']
})
export class AuthButtonComponent implements OnInit, OnDestroy {
  readonly clientId = environment.google_auth_client_id;
  credentialResponse = new EventEmitter<CredentialResponse>();
  subs: Subscription[] = [];

  constructor(private userService: CurrentUserService, private zone: NgZone) {
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  ngOnInit() {
    this.subs.push(
      this.credentialResponse.subscribe(credentialResponse => this.userService.setCurrentUser(credentialResponse))
    );

    (<any>window).handleCredentialResponse = (credentialResponse: CredentialResponse) => {
      console.log('handleCredentialResponse', credentialResponse);
      this.zone.run(() => this.credentialResponse.emit(credentialResponse));
    }

    let node = document.createElement('script');
    node.src = 'https://accounts.google.com/gsi/client';
    node.type = 'text/javascript';
    node.async = true;
    node.defer = true;
    document.getElementById('scriptLoader')?.appendChild(node);
  }
}
