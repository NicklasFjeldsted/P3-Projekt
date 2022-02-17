import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndbetalComponent } from './components/indbetal/indbetal.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {path: '', component: LoginComponent },
  {path: 'indbetal', component: IndbetalComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
