import {Component} from '@angular/core';
import {CurrentUserService} from "../services/current-user.service";
import {CredentialResponse} from "../model/model";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private currentUserService: CurrentUserService) {
  }

  login() {
    this.currentUserService.setCurrentUser(new CredentialResponse('i7', 'i7', '', ''));
  }

  logout() {
    this.currentUserService.setCurrentUser();
  }
}
