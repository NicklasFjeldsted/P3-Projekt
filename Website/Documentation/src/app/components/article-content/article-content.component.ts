import { Component, Input, OnInit } from '@angular/core';
import { Content, Header, Codeblock, Textarea } from '../../interfaces';

@Component({
  selector: 'article-content',
  templateUrl: './article-content.component.html',
  styleUrls: ['./article-content.component.css']
})
export class ArticleContentComponent
{
	constructor() { }

	@Input() articleContent!: Content;

	public get get_header(): Header
	{
		return <Header>this.articleContent;
	}

	public get get_codeblock(): Codeblock
	{
		return <Codeblock>this.articleContent;
	}

	public get get_textarea(): Textarea
	{
		return <Textarea>this.articleContent;
	}

	public get_id(value: string): string
	{
		return value.toLowerCase().replace(' ', '-');
	}

}
