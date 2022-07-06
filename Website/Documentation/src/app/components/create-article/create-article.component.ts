import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CodeblockControl, TextareaControl, HeaderControl, FieldType } from '../../interfaces';
import { Firestore, doc, getDoc, connectFirestoreEmulator, setDoc, EmulatorMockTokenOptions } from '@angular/fire/firestore';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css']
})
export class CreateArticleComponent implements OnInit
{
  	constructor(private http: HttpClient, private firestore: Firestore) {}

	ngOnInit(): void
	{

	}

  	codeblockArray: CodeblockControl[] = [];
  	textareaArray: TextareaControl[] = [];
  	headerArray: HeaderControl[] = [];

	public index: number = 0;

	public articleControl: FormGroup = new FormGroup({
		title: new FormControl('', Validators.required),
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


		this.uploadArticle();

		// let jsonString: string = JSON.stringify(this.articleControl.value);
		// this.http.post(`http://10.0.6.2:444/api/JsonSaver/save`, this.articleControl.value).subscribe((res) => console.log(res));
	}

	private async uploadArticle(): Promise<void>
	{
		const docRef = doc(this.firestore, 'articles', this.articleControl.get('title')?.value);
		return await setDoc(docRef, this.articleControl.value).then(async() =>
		{
			return await this.uploadCategory();
		});
	}

	private async uploadCategory(): Promise<void>
	{
		if (typeof this.articleControl.get('category')?.value === 'string')
		{
			const sidebarRef = doc(this.firestore, 'sidebar-content', this.articleControl.get('category')?.value);
			let categoryObj: { [ key: string ]: any; } = {};
			categoryObj[ this.articleControl.get('title')?.value ] = this.articleControl.get('title')?.value;
			return await setDoc(sidebarRef, categoryObj);
		}
		else
		{
			let categoryObj: { [ key: string ]: any; } = this.buildCategoryObject(Object.entries(this.articleControl.get('category')?.value)[0][1], this.articleControl.get('title')?.value);
			const sidebarRef = doc(this.firestore, 'sidebar-content', Object.keys(this.articleControl.get('category')?.value)[0]);
			return await setDoc(sidebarRef, categoryObj);
		}
	}

	private buildCategoryObject(inputValue: any, endpoint: string): object
	{
		let output: { [ key: string ]: any; } = {};

		if (typeof inputValue === 'string')
		{
			let endpointObj: { [ key: string ]: any; } = {};
			endpointObj[ endpoint ] = endpoint;
			output[ inputValue ] = endpointObj;
		}

		if (typeof inputValue === 'object')
		{
			for (const property of Object.entries(inputValue))
			{
				output[ property[ 0 ] ] = this.buildCategoryObject(property[ 1 ], endpoint);
			}
		}

		return output;
	}

	public update_index(newIndex: number, content: any): void
	{
		content.value.index = Number(newIndex);
	}

	public get tags(): FormArray
	{
		return this.articleControl.controls[ 'tags' ] as FormArray;
	}
}
