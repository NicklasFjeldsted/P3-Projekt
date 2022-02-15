import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { TilmedComponent } from './tilmed/tilmed.component';
import { TlmdnextpageComponent } from './tlmdnextpage/tlmdnextpage.component';
import { UdbetalComponent } from './udbetal/udbetal.component';
import { KontoComponent } from './konto/konto.component';
import { KontokonformationComponent } from './kontokonformation/kontokonformation.component';
import { IndbetalComponent } from './indbetal/indbetal.component';
import { DeaktiverComponent } from './deaktiver/deaktiver.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TilmedComponent,
    TlmdnextpageComponent,
    UdbetalComponent,
    KontoComponent,
    KontokonformationComponent,
    IndbetalComponent,
    DeaktiverComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
