import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import hljs from 'highlight.js';
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
		setTimeout(() => hljs.highlightAll(), 0);
	}

	public load_data(title: string): void
	{
		this.article = articlesData.filter(x => x.title == title)[0];
	}
}

export interface Article
{
	title: string;
	author: string;
	date: string;
	category: string;
	tags: string[];
	content: Content[];
}

export interface Header extends Content
{
	header_level?: number;
}

export interface Textarea extends Content
{
	font_size?: number;
	font_style?: string;
	color?: string;
	link?: string;
}

export interface Codeblock extends Content
{
	font_size?: number;
	language?: string;
}

export interface Content
{
	index: number;
	type: number;
	text: string;
}
