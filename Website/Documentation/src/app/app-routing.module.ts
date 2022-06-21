import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleComponent } from './components/article/article.component';
import { CreateArticleComponent } from './components/create-article/create-article.component';

const routes: Routes = [
	{ path: "article", component: ArticleComponent },
	{ path: "article/create", component: CreateArticleComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
