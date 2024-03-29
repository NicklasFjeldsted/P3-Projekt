import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login/login.component";
import { HeaderComponent } from "./components/header/header.component";
import { KontoComponent } from "./components/konto/konto.component";
import { HomeComponent } from "./components/home/home.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthenticationService } from "./services/authentication.service";
import { AuthenticationInterceptorInterceptor } from "./interceptors/authentication-interceptor.interceptor";
import { BlackjackComponent } from "./components/blackjack/blackjack.component";
import { TilmeldComponent } from "./components/tilmeld/tilmeld.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RouterModule } from "@angular/router";
import { appInitializer } from "./helpers/app.initializer";
import { DataService } from "./services/data.service";
import { ClickOutsideModule } from "ng-click-outside";
import { KontaktComponent } from "./components/kontakt/kontakt.component";
import { SupportComponent } from "./components/support/support.component";
import { ReglerOgBetingelserComponent } from "./components/reglerOgBetingelser/reglerOgBetingelser.component";
import { OmOsComponent } from "./components/om-os/om-os.component";
import { RouletteComponent } from "./components/roulette/roulette.component";
import { SlotsComponent } from "./components/slots/slots.component";
import { IndbetalComponent } from "./components/modals/indbetal/indbetal.component";
import { UdbetalComponent } from "./components/modals/udbetal/udbetal.component";
import { AngularMaterialModuleModule } from "./modules/angular-material-module/angular-material-module.module";
import { FooterComponent } from "./components/footer/footer.component";
import { GameInfobarComponent } from "./components/game-infobar/game-infobar.component";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { AdministrationComponent } from "./components/administration/administration.component";
import { EditUserComponent } from "./components/modals/action-modals/edit-user/edit-user.component";
import { EditBalanceComponent } from "./components/modals/action-modals/edit-balance/edit-balance.component";
import { DeactivateUserComponent } from "./components/modals/action-modals/deactivate-user/deactivate-user.component";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";

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
    IndbetalComponent,
    UdbetalComponent,
    FooterComponent,
    GameInfobarComponent,
    AdministrationComponent,
    EditUserComponent,
    EditBalanceComponent,
    DeactivateUserComponent,
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
    AngularMaterialModuleModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthenticationService, DataService] },
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptorInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {}
}
// "outputPath": "//10.0.6.2/www",
