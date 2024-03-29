import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { KontoComponent } from "./components/konto/konto.component";
import { HomeComponent } from "./components/home/home.component";
import { AuthenticationGuard } from "./services/authentication-guard.service";
import { BlackjackComponent } from "./components/blackjack/blackjack.component";
import { TilmeldComponent } from "./components/tilmeld/tilmeld.component";
import { KontaktComponent } from "./components/kontakt/kontakt.component";
import { SupportComponent } from "./components/support/support.component";
import { ReglerOgBetingelserComponent } from "./components/reglerOgBetingelser/reglerOgBetingelser.component";
import { OmOsComponent } from "./components/om-os/om-os.component";
import { RouletteComponent } from "./components/roulette/roulette.component";
import { SlotsComponent } from "./components/slots/slots.component";
import { AdministrationComponent } from "./components/administration/administration.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "administration", component: AdministrationComponent },
  { path: "login", component: LoginComponent },
  { path: "tilmeld", component: TilmeldComponent },
  { path: "kontakt", component: KontaktComponent },
  { path: "support", component: SupportComponent },
  { path: "reglerOgBetingelser", component: ReglerOgBetingelserComponent },
  { path: "om-os", component: OmOsComponent },

  { path: "konto", component: KontoComponent, canActivate: [AuthenticationGuard] },
  { path: "blackjack", component: BlackjackComponent, canActivate: [AuthenticationGuard], canDeactivate: [BlackjackComponent] },
  { path: "roulette", component: RouletteComponent, canActivate: [AuthenticationGuard] },
  { path: "slots", component: SlotsComponent, canActivate: [AuthenticationGuard] },

  { path: "**", redirectTo: "" }, // MUST BE LAST IN THE ARRAY!
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
