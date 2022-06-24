import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, NgForm, NgModelGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType } from '../create-article/create-article.component';

@Component({
  selector: 'input-fieldarea',
  templateUrl: './input-fieldarea.component.html',
  styleUrls: ['./input-fieldarea.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgModelGroup }],
})
export class InputFieldareaComponent
{
	constructor() { }

	@Input() name: string = "Empty Name..";
	@Input() placeholder: string = "";
	@Input() label: string = "Empty Label";
	@Input() static: boolean = true;
	@Input() index: number = 0;
	@Input() fieldType!: FieldType;
	@Output() output: EventEmitter<number> = new EventEmitter<number>();


	public index_changed(value: any): void
	{
		console.log("InputFieldareaComponent::index_changed()");
		this.output.emit(value);
	}
}
