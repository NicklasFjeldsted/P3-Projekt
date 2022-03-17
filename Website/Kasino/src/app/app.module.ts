import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { IndbetalComponent } from './components/indbetal/indbetal.component';
import { KontoComponent } from './components/konto/konto.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UdbetalComponent } from './components/udbetal/udbetal.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationService } from './services/authentication.service';
import { AuthenticationInterceptorInterceptor } from './interceptors/authentication-interceptor.interceptor';
import { BlackjackComponent } from './components/blackjack/blackjack.component';
import { TilmeldComponent } from './components/tilmeld/tilmeld.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faFlag } from '@fortawesome/free-regular-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { RouterModule } from '@angular/router';
import { appInitializer } from './helpers/app.initializer';
import { DataService } from './services/data.service';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ClickOutsideModule } from 'ng-click-outside';
import { KontaktComponent } from './components/kontakt/kontakt.component';
import { SupportComponent } from './components/support/support.component';
import { ReglerOgBetingelserComponent } from './components/reglerOgBetingelser/reglerOgBetingelser.component';
import { OmOsComponent } from './components/om-os/om-os.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    IndbetalComponent,
    KontoComponent,
    UdbetalComponent,
    HomeComponent,
    BlackjackComponent,
    TilmeldComponent,
    KontaktComponent,
    SupportComponent,
    ReglerOgBetingelserComponent,
    OmOsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatNativeDateModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    HttpClientModule,
    ClickOutsideModule
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthenticationService, DataService] },
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() { }

}
// "outputPath": "//10.0.6.2/www",
