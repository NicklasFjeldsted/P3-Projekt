import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { InputFieldareaComponent } from '../input-fieldarea/input-fieldarea.component';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css']
})
export class CreateArticleComponent implements OnInit {

	constructor(private x: ViewContainerRef) { }

	@ViewChild('article_content') parent!: ElementRef;

	ngOnInit(): void {}

	public add_field(fieldType: FieldType): void
	{
		switch (fieldType)
		{
			case FieldType.Codeblock:
				const component = this.x.createComponent(InputFieldareaComponent);

				component.location.nativeElement = this.parent;

				const instance = component.instance;
				instance.label = "Codeblock";
				instance.name = "codeblock";
				instance.placeholder = "Enter Code..";
				break;

			case FieldType.Header:
				let x1= '<input-field type="text" name="header" label="Header" placeholder="Enter Header.."></input-field>';
				break;

			case FieldType.Textarea:
				let x2 = '<input-fieldarea name="textarea" label="Textarea" placeholder="Enter Text.."></input-fieldarea>';
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
