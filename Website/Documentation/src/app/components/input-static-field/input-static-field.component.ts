import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'input-static-field',
  templateUrl: './input-static-field.component.html',
  styleUrls: ['./input-static-field.component.css']
})
export class InputStaticFieldComponent {

  constructor() { }

	@Input() name: string = "Empty Name..";
	@Input() type: string = "text";
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
