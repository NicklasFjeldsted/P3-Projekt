import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { IndbetalComponent } from './components/indbetal/indbetal.component';
import { KontoComponent } from './components/konto/konto.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UdbetalComponent } from './components/udbetal/udbetal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    IndbetalComponent,
    KontoComponent,
    UdbetalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
