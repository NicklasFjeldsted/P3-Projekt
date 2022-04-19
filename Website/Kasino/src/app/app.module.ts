import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { KontoComponent } from './components/konto/konto.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationService } from './services/authentication.service';
import { AuthenticationInterceptorInterceptor } from './interceptors/authentication-interceptor.interceptor';
import { BlackjackComponent } from './components/blackjack/blackjack.component';
import { TilmeldComponent } from './components/tilmeld/tilmeld.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { appInitializer } from './helpers/app.initializer';
import { DataService } from './services/data.service';
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
import { AngularMaterialModuleModule } from './modules/angular-material-module/angular-material-module.module';
import { FooterComponent } from './components/footer/footer.component';


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
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FontAwesomeModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ClickOutsideModule,
    AngularMaterialModuleModule
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
