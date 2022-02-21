import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DeaktiverComponent } from './deaktiver/deaktiver.component';
import { HomeComponent } from './home/home.component';
import { IndbetalComponent } from './indbetal/indbetal.component';
import { KontoComponent } from './konto/konto.component';
import { KontokonformationComponent } from './kontokonformation/kontokonformation.component';
import { LoginComponent } from './login/login.component';
import { TilmedComponent } from './tilmed/tilmed.component';
import { TlmdnextpageComponent } from './tlmdnextpage/tlmdnextpage.component';
import { UdbetalComponent } from './udbetal/udbetal.component';

const routes: Routes = [
  { path: 'deaktiver', component: DeaktiverComponent },
  {path:'', component:HomeComponent                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   }, // redirectTo:'', pathMatch:'full'// 
  { path: 'indbetal', component: IndbetalComponent },
  { path: 'Konto', component: KontoComponent },
  
  { path: 'Kontokonformation', component: KontokonformationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'tilmed', component: TilmedComponent },
  { path: 'tlmdnextpage', component: TlmdnextpageComponent },
  { path: 'udbetal', component: UdbetalComponent },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

  
})
export class AppRoutingModule { }
