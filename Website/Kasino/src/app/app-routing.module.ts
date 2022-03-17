import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UdbetalComponent } from './components/udbetal/udbetal.component';
import { IndbetalComponent } from './components/indbetal/indbetal.component';
import { LoginComponent } from './components/login/login.component';
import { KontoComponent } from './components/konto/konto.component';
import { HomeComponent } from './components/home/home.component';
import { AuthenticationGuard } from './services/authentication-guard.service';
import { BlackjackComponent } from './components/blackjack/blackjack.component';
import { TilmeldComponent } from './components/tilmeld/tilmeld.component';
import { KontaktComponent } from './components/kontakt/kontakt.component';
import { SupportComponent } from './components/support/support.component';
import { ReglerOgBetingelserComponent } from './components/reglerOgBetingelser/reglerOgBetingelser.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'tilmeld', component: TilmeldComponent },
  { path: 'konto', component: KontoComponent, canActivate: [ AuthenticationGuard ] },
  { path: 'udbetal', component: UdbetalComponent},
  { path: 'indbetal', component: IndbetalComponent},
  { path: 'blackjack', component: BlackjackComponent, canActivate: [ AuthenticationGuard ] },
  { path: 'kontakt', component: KontaktComponent},
  { path: 'support', component: SupportComponent},
  { path: 'reglerOgBetingelser', component: ReglerOgBetingelserComponent},





  
  { path: '**', redirectTo: '' }  // MUST BE LAST IN THE ARRAY!
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
