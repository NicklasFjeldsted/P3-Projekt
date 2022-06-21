import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css']
})
export class CreateArticleComponent implements OnInit {

	constructor() { }

	ngOnInit(): void {
	}

	public num: number[] = [];

	public add_field(fieldType: FieldType): void
	{
		switch (fieldType)
		{
			case FieldType.Codeblock:
				this.num.push(0);
				break;

			case FieldType.Header:
				break;

			case FieldType.Textarea:
				break;
		}
	}

}

export enum FieldType
{
	Textarea,
	Codeblock,
	Header
}
