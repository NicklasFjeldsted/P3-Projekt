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
import { InputFieldComponent } from './components/input-field/input-field.component';
import { InputFieldareaComponent } from './components/input-fieldarea/input-fieldarea.component';
import { ArticleContentCreatorComponent } from './components/article-content-creator/article-content-creator.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    DropdownComponent,
    ArticleComponent,
    CreateArticleComponent,
    ArticleContentComponent,
    InputFieldComponent,
    InputFieldareaComponent,
    ArticleContentCreatorComponent
  ],
  imports: [
    BrowserModule,
	AppRoutingModule,
	  ReactiveFormsModule,
	  FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
