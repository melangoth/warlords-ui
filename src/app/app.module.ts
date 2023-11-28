import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LeftSidePanelComponent} from './left-side-panel/left-side-panel.component';
import {QuickStartComponent} from './quick-start/quick-start.component';
import {FreeRouteOneComponent} from './free-route-one/free-route-one.component';
import {ProfileComponent} from './profile/profile.component';
import {LoginComponent} from './login/login.component';
import {AuthButtonComponent} from './auth-button/auth-button.component';
import {WarlordsModule} from "./warlords/warlords.module";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    LeftSidePanelComponent,
    QuickStartComponent,
    FreeRouteOneComponent,
    ProfileComponent,
    LoginComponent,
    AuthButtonComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    WarlordsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
