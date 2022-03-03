import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UdbetalComponent } from './components/udbetal/udbetal.component';
import { IndbetalComponent } from './components/indbetal/indbetal.component';
import { LoginComponent } from './components/login/login.component';
import { KontoComponent } from './components/konto/konto.component';
import { HomeComponent } from './components/home/home.component';
import { AuthenticationService } from './services/authentication.service';
import { BlackjackComponent } from './components/blackjack/blackjack.component';
import { TilmeldComponent } from './components/tilmeld/tilmeld.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent },
  {path: 'tilmeld', component: TilmeldComponent},
  {path: 'konto', component: KontoComponent, canActivate: [AuthenticationService] },
  {path: 'blackjack', component: BlackjackComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
