import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { FieldType } from '../create-article/create-article.component';

@Component({
  selector: 'input-fieldarea',
  templateUrl: './input-fieldarea.component.html',
  styleUrls: ['./input-fieldarea.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class InputFieldareaComponent
{
	constructor() { }

	@Input() group!: FormGroup;

	@Input() placeholder: string = "";
	@Input() label: string = "Empty Label";
	@Input() index: number = 0;
	@Input() isCodeblock!: boolean;
	@Output() output: EventEmitter<number> = new EventEmitter<number>();


	public index_changed(value: any): void
	{
		this.output.emit(value);
	}
}
