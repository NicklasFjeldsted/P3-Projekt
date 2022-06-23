import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { InputFieldComponent } from '../input-field/input-field.component';
import { InputFieldareaComponent } from '../input-fieldarea/input-fieldarea.component';

@Component({
  selector: 'article-content-creator',
  templateUrl: './article-content-creator.component.html',
  styleUrls: ['./article-content-creator.component.css']
})
export class ArticleContentCreatorComponent implements OnInit {

	constructor(private hostView: ViewContainerRef) { }

	ngOnInit(): void { }

	private contentNum: number = 0;

	public add_field(fieldType: FieldType): void
	{
		let num = this.contentNum++;
		switch (fieldType)
		{
			case FieldType.Codeblock:
				const codeblockComponent = this.hostView.createComponent(InputFieldareaComponent);
				const codeblockRef = codeblockComponent.location;
				codeblockRef.nativeElement.style.order = num;
				const codeblockInstance = codeblockComponent.instance;
				codeblockInstance.label = "Codeblock";
				codeblockInstance.name = "codeblock";
				codeblockInstance.placeholder = "Enter Code..";
				codeblockInstance.static = false;
				codeblockInstance.index = num;
				codeblockInstance.selfElement = codeblockComponent.location;
				break;

			case FieldType.Header:
				const headerComponent = this.hostView.createComponent(InputFieldComponent);
				const headerRef = headerComponent.location;
				headerRef.nativeElement.style.order = num;
				const headerInstance = headerComponent.instance;
				headerInstance.label = "Header";
				headerInstance.name = "header";
				headerInstance.placeholder = "Enter Header..";
				headerInstance.type = "text";
				headerInstance.static = false;
				headerInstance.index = num;
				headerInstance.selfElement = headerComponent.location;
				break;

			case FieldType.Textarea:
				const textareaComponent = this.hostView.createComponent(InputFieldareaComponent);
				const textareaRef = textareaComponent.location;
				textareaRef.nativeElement.style.order = num;
				const textareaInstance = textareaComponent.instance;
				textareaInstance.label = "Textarea";
				textareaInstance.name = "textarea";
				textareaInstance.placeholder = "Enter Text..";
				textareaInstance.static = false;
				textareaInstance.index = num;
				textareaInstance.selfElement = textareaComponent.location;
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
