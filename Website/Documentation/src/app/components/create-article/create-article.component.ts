import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CodeblockControl, TextareaControl, HeaderControl, FieldType } from '../../interfaces';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css']
})
export class CreateArticleComponent implements OnInit
{
  	constructor(private http: HttpClient) {}

  	ngOnInit(): void {}

  	codeblockArray: CodeblockControl[] = [];
  	textareaArray: TextareaControl[] = [];
  	headerArray: HeaderControl[] = [];

	public index: number = 0;

	public articleControl: FormGroup = new FormGroup({
		title: new FormControl(''),
		author: new FormControl(''),
		date: new FormControl(''),
		category: new FormControl(''),
		tags: new FormArray([]),
		content: new FormArray([])
	});

	add_field(fieldType: FieldType): void
	{
		let num: number = this.index++;
		let content = this.articleControl.get('content') as FormArray;
		switch (fieldType)
		{
			case FieldType.Textarea:
				let textareaGroup = new FormGroup({
					index: new FormControl(Number(num)),
					type: new FormControl(FieldType.Textarea),
					text: new FormControl(''),
					font_size: new FormControl(16),
					font_style: new FormControl('normal'),
					link: new FormGroup({
						text: new FormControl(''),
						url: new FormControl('')
					})
				});
				this.textareaArray.push(textareaGroup as TextareaControl);
				content.push(textareaGroup);
				break;

			case FieldType.Codeblock:
				let codeblockControl = new FormGroup({
					index: new FormControl(Number(num)),
					type: new FormControl(FieldType.Codeblock),
					text: new FormControl(''),
					font_size: new FormControl(16),
					language: new FormControl('cs')
				});
				this.codeblockArray.push(codeblockControl as CodeblockControl);
				content.push(codeblockControl);
				break;

			case FieldType.Header:
				let headerControl = new FormGroup({
					index: new FormControl(Number(num)),
					type: new FormControl(FieldType.Header),
					text: new FormControl(''),
					header_level: new FormControl(0)
				});
				this.headerArray.push(headerControl as HeaderControl);
				content.push(headerControl);
				break;
		}
	}

	public submit_article(): void
	{
		if (!this.articleControl.valid)
		{
			console.error("Not Valid!");
			return;
		}

		let jsonString: string = JSON.stringify(this.articleControl.value);
		console.log(this.articleControl.value);

		//this.http.post(`https://localhost:7094/api/JsonSaver/save`, this.articleControl.value).subscribe((res) => console.log(res));
	}

	public update_index(newIndex: number, content: any): void
	{
		content.value.index = Number(newIndex);
	}
}
