import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UdbetalComponent } from './components/udbetal/udbetal.component';
import { IndbetalComponent } from './components/indbetal/indbetal.component';
import { LoginComponent } from './components/login/login.component';
import { KontoComponent } from './components/konto/konto.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth-guard.services';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path: 'indbetal', component: IndbetalComponent, canActivate: [AuthGuard] },
  {path: 'udbetal', component: UdbetalComponent },
  {path: 'konto', component: KontoComponent },
  {path: '', component: HomeComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
