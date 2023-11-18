import {Component} from '@angular/core';
import {CurrentUser, CurrentUserService} from "../services/current-user.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-left-side-panel',
  templateUrl: './left-side-panel.component.html',
  styleUrls: ['./left-side-panel.component.scss']
})
export class LeftSidePanelComponent {
  loggedInUser$: Observable<CurrentUser | undefined>;

  constructor(private currentUserService: CurrentUserService) {
    this.loggedInUser$ = currentUserService.currentUser$
  }

}
