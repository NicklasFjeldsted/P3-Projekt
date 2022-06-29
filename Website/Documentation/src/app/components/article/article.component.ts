import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import hljs from 'highlight.js';
import { Article } from '../../interfaces';
import articlesData from '../../../assets/data/articles.json';
import sidebarContent from '../../../assets/data/sidebar-content.json';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

	constructor(private route: ActivatedRoute, private router: Router) { }

	public article!: Article;
	public categoryArticles: string[] = [];

	ngOnInit(): void
	{
		this.route.queryParams.subscribe(params =>
			{
				if (params[ 'title' ] === undefined)
				{
					this.router.navigate([ '/' ]);
				}
				this.load_data(params[ 'title' ]);
		});
	}

	public load_data(title: string): void
	{
		this.article = articlesData.filter(x => x.title == title)[ 0 ];

		this.categoryArticles = [];

		for(const pair of Object.entries(sidebarContent)) {
			if(pair[0] != this.article.category) {
				continue;
			}
			for(const value of Object.values(pair[1])) {
				this.categoryArticles.push(value);
			}
		}
		this.currentArticleIndex = this.categoryArticles.indexOf(this.article.title);
		setTimeout(() => hljs.highlightAll(), 10);
	}

	public get_date(): Date
	{
		return new Date(this.article.date);
	}

	public currentArticleIndex: number = 0;
	public navigate(direction: number): void {
		this.currentArticleIndex += direction;
		this.router.navigate(['/article'], {queryParams: { title: this.categoryArticles[this.currentArticleIndex]}})
	}
}

