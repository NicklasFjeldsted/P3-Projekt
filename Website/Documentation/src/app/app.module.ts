import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { ArticleComponent } from './components/article/article.component';
import { CreateArticleComponent } from './components/create-article/create-article.component';
import { ArticleContentComponent } from './components/article-content/article-content.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    DropdownComponent,
    ArticleComponent,
    CreateArticleComponent,
    ArticleContentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
