import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { KontoComponent } from './components/konto/konto.component';
import { HomeComponent } from './components/home/home.component';
import { AuthenticationGuard } from './services/authentication-guard.service';
import { BlackjackComponent } from './components/blackjack/blackjack.component';
import { TilmeldComponent } from './components/tilmeld/tilmeld.component';
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

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'tilmeld', component: TilmeldComponent },
  { path: 'kontakt', component: KontaktComponent},
  { path: 'support', component: SupportComponent},
  { path: 'reglerOgBetingelser', component: ReglerOgBetingelserComponent},
  { path: 'om-os', component: OmOsComponent},
  { path: 'generalt', component: GeneraltComponent},
  { path: 'help-indbetaling', component: HelpIndbetalingComponent},
  { path: 'help-udbetaling', component: HelpUdbetalingComponent},
  { path: 'help-login', component: HelpLoginComponent},
  { path: 'velkomstbonusser', component: VelkomstbonusserComponent},
  
  
  { path: 'konto', component: KontoComponent, canActivate: [ AuthenticationGuard ] },
  { path: 'blackjack', component: BlackjackComponent, canActivate: [ AuthenticationGuard ], canDeactivate: [ BlackjackComponent ] },
  { path: 'roulette', component: RouletteComponent, canActivate: [ AuthenticationGuard ]},
  { path: 'slots', component: SlotsComponent, canActivate: [ AuthenticationGuard ]},
  
  
  
  { path: '**', redirectTo: '' }  // MUST BE LAST IN THE ARRAY!
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
