import { Component, Input, OnInit } from '@angular/core';
import { Content } from '../article/article.component';

@Component({
  selector: 'article-content',
  templateUrl: './article-content.component.html',
  styleUrls: ['./article-content.component.css']
})
export class ArticleContentComponent implements OnInit {

	constructor() { }

	@Input() articleContent!: Content;

	ngOnInit(): void
	{
	}

	public get_id(value: string): string
	{
		return value.toLowerCase().replace(' ', '-');
	}

}
