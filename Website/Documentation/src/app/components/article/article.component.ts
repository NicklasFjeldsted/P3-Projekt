import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import hljs from 'highlight.js';
import { Article } from '../../interfaces';
import articlesData from '../../../assets/data/articles.json';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

	constructor(private route: ActivatedRoute, private router: Router) { }

	public article!: Article;

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
		setTimeout(() => hljs.highlightAll(), 10);
	}

	public get_date(): string
	{
		return this.article.date.replace('-', '/');
	}
}

