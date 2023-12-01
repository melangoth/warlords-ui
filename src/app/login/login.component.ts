import {Component} from '@angular/core';
import {CurrentUserService} from '../services/current-user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private currentUserService: CurrentUserService) {
  }

  logout() {
    this.currentUserService.setCurrentUser();
  }

  testCORS() {
    this.currentUserService.testCors();
  }

  testSafe() {
    this.currentUserService.testSafe();
  }
}
