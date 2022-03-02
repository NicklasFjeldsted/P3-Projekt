import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UdbetalComponent } from './components/udbetal/udbetal.component';
import { IndbetalComponent } from './components/indbetal/indbetal.component';
import { LoginComponent } from './components/login/login.component';
import { KontoComponent } from './components/konto/konto.component';
import { HomeComponent } from './components/home/home.component';
import { AuthenticationService } from './services/authentication.service';
import { BlackjackComponent } from './components/blackjack/blackjack.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path: 'konto', component: KontoComponent, canActivate: [AuthenticationService] },
  {path: '', component: HomeComponent},
  {path: 'blackjack', component: BlackjackComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
