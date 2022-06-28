import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';

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
	@Output() output: EventEmitter<number> = new EventEmitter<number>();

	public index_changed(value: any): void
	{
		this.output.emit(value);
	}

	public get Type(): number
	{
		return this.group.get('type')!.value;
	}
}
