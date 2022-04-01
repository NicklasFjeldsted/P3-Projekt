import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { KontoComponent } from './components/konto/konto.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationService } from './services/authentication.service';
import { AuthenticationInterceptorInterceptor } from './interceptors/authentication-interceptor.interceptor';
import { BlackjackComponent } from './components/blackjack/blackjack.component';
import { TilmeldComponent } from './components/tilmeld/tilmeld.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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
import { RouletteComponent } from './components/roulette/roulette.component';
import { SlotsComponent } from './components/slots/slots.component';
import { GeneraltComponent } from './components/helpcenter-components/generalt/generalt.component';
import { HelpIndbetalingComponent } from './components/helpcenter-components/help-indbetaling/help-indbetaling.component';
import { HelpUdbetalingComponent } from './components/helpcenter-components/help-udbetaling/help-udbetaling.component';
import { HelpLoginComponent } from './components/helpcenter-components/help-login/help-login.component';
import { VelkomstbonusserComponent } from './components/helpcenter-components/velkomstbonusser/velkomstbonusser.component';
import { IndbetalComponent } from './components/modals/indbetal/indbetal.component';
import { UdbetalComponent } from './components/modals/udbetal/udbetal.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { LogoutComponent } from './components/modals/logout/logout.component';
import { FooterComponent } from './components/footer/footer.component';
import { DeaktiverComponent } from './components/modals/deaktiver/deaktiver.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    KontoComponent,
    HomeComponent,
    BlackjackComponent,
    TilmeldComponent,
    KontaktComponent,
    SupportComponent,
    ReglerOgBetingelserComponent,
    OmOsComponent,
    RouletteComponent,
    SlotsComponent,
    GeneraltComponent,
    HelpIndbetalingComponent,
    HelpUdbetalingComponent,
    HelpLoginComponent,
    VelkomstbonusserComponent,
    IndbetalComponent,
    UdbetalComponent,
    LogoutComponent,
    FooterComponent,
    DeaktiverComponent,
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
    ClickOutsideModule,
    OverlayModule
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
