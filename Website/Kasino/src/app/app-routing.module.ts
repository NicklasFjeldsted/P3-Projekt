import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndbetalComponent } from './components/indbetal/indbetal.component';
import { LoginComponent } from './components/login/login.component';
import { KontoComponent } from './components/konto/konto.component';

const routes: Routes = [
  {path: '', component: LoginComponent },
  {path: 'indbetal', component: IndbetalComponent },
  {path: 'konto', component: KontoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
