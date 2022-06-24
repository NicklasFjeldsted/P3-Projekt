import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlContainer, FormGroup, NgModelGroup } from '@angular/forms';

@Component({
  selector: 'input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgModelGroup }],

})
export class InputFieldComponent
{
	constructor() { }

	@Input() group!: FormGroup;

	@Input() name: string = "Empty Name..";
	@Input() type: string = "text";
	@Input() placeholder: string = "";
	@Input() label: string = "Empty Label";
	@Input() index: number = 0;
	@Output() output: EventEmitter<number> = new EventEmitter<number>();


	public index_changed(value: any): void
	{
		this.output.emit(Number(value));
	}
}
