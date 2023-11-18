import {inject, NgModule} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterModule,
  RouterStateSnapshot,
  Routes,
  UrlTree
} from '@angular/router';
import {QuickStartComponent} from './quick-start/quick-start.component';
import {FreeRouteOneComponent} from './free-route-one/free-route-one.component';
import {ProfileComponent} from './profile/profile.component';
import {Observable} from 'rxjs';
import {CurrentUserService} from './services/current-user.service';
import {LoginComponent} from './login/login.component';
import {WorldComponent} from './warlords/world/world.component';

const profileGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  const currentUser = inject(CurrentUserService).getCurrentUser();
  console.log('currentUser', currentUser)

  // 👇 Redirects to another route
  if (!currentUser) {
    return inject(Router).createUrlTree(["/", "login"]);
  } else {
    const profilePageId = route.params["id"];
    console.log('profilePageId', profilePageId);

    // 👇 Grants or deny access to this route
    const attemptsToAccessItsOwnPage = currentUser.id === profilePageId || profilePageId === undefined;
    console.log('attemptsToAccessItsOwnPage', attemptsToAccessItsOwnPage);
    return attemptsToAccessItsOwnPage;
  }
};

const routes: Routes = [
  {path: '', redirectTo: '/quick-start', pathMatch: 'full'},
  {path: 'quick-start', component: QuickStartComponent},
  {path: 'free-route-one', component: FreeRouteOneComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [profileGuard]},
  {path: 'login', component: LoginComponent},

  // warlords
  {path: 'warlords/world', component: WorldComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
