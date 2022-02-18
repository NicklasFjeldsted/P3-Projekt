import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UdbetalComponent } from './components/udbetal/udbetal.component';
import { LoginComponent } from './components/login/login.component';
import { KontoComponent } from './components/konto/konto.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {path: '', component: LoginComponent },
  {path: 'udbetal', component: UdbetalComponent },
  {path: 'konto', component: KontoComponent },
  {path: 'home', component: HomeComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
