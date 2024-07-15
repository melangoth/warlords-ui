import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {CurrentUserService} from "../services/current-user.service";

@Component({
  selector: 'app-free-route-one',
  templateUrl: './free-route-one.component.html',
  styleUrls: ['./free-route-one.component.scss']
})
export class FreeRouteOneComponent {
  constructor(http: HttpClient, user: CurrentUserService) {

    const backend = environment.warlords_backend_url;

    let token = user.getCurrentUser()?.token;
    const headers = {'Authorization': `Bearer ${token}`};

    http.get(`${backend}/api/user/free`).subscribe(response => {
      console.log('free route accessed', response);
    });

    http.get(`${backend}/api/user/secure`, {headers}).subscribe(response => {
      console.log('secure route accessed', response);
    });
  }
}
