import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { APIFetchComponent } from './api-fetch/api-fetch.component';

const routes: Routes = [
  {path: '', component: APIFetchComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
