import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClassComponent } from './components/class/class.component';
import { PropertiesComponent } from './components/properties/properties.component';
import { MethodsComponent } from './components/methods/methods.component';
import { SubClassComponent } from './components/sub-class/sub-class.component';
import { TypeComponent } from './components/type/type.component';

@NgModule({
  declarations: [
    AppComponent,
    ClassComponent,
    PropertiesComponent,
    MethodsComponent,
    SubClassComponent,
    TypeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
