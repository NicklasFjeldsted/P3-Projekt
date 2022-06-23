import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, NgForm, NgModelGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

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
	@Output() output: EventEmitter<number> = new EventEmitter<number>();


	public index_changed(value: any): void
	{
		this.output.emit(value);
	}
}
