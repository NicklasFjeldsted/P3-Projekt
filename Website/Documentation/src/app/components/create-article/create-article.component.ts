import { Component, ElementRef, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ControlContainer, FormArray, FormControl, FormGroup, NgForm, NgModelGroup } from '@angular/forms';
import { Codeblock, Header, Textarea } from '../article/article.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css']
})
export class CreateArticleComponent implements OnInit
{
  constructor() {}

  ngOnInit(): void {}

  	codeblockArray: Codeblock[] = [];
  	textareaArray: Textarea[] = [];
  	headerArray: Header[] = [];

  	public index: number = 0;

	add_field(fieldType: FieldType): void
	{
		let num: number = this.index++;
		switch (fieldType)
		{
			case FieldType.Textarea:
				this.textareaArray.push({index: num, type: 0, text: '', font_size: 16, font_style: '', color: 'rgba(255, 255, 255, 1)', link: ''});
				break;

			case FieldType.Codeblock:
				this.codeblockArray.push({index: num, type: 1, text: '', font_size: 16, language: 'cs' });
				break;

			case FieldType.Header:
				this.headerArray.push({index: num, type: 2, text: '', header_level: 0 });
				break;
		}
	}

	public submit_article(form: NgForm): void
	{
		let output: FormGroup = new FormGroup({
			title: new FormControl(form.controls['title'].value),
			author: new FormControl(form.controls['author'].value),
			date: new FormControl(form.controls['date'].value),
			category: new FormControl(form.controls['category'].value),
			tags: new FormControl(form.controls['tags'].value),
			content: new FormArray([])
		});

		let contentArray = output.get('content') as FormArray;

		for(const originalContentObject of Object.entries(form.controls['content'].value))
		{
			let fieldObject = new FormGroup({});
			let castContentObject: any = originalContentObject[ 1 ];

			for(const property in castContentObject)
			{
				fieldObject.addControl(property, new FormControl(castContentObject[property]));
			}

			contentArray.push(fieldObject);
		}

		console.log(output.value);
	}

	public update_index(newIndex: number, content: any): void
	{
		content.index = newIndex;
	}
}

export enum FieldType
{
  	Textarea,
  	Codeblock,
	Header
}
