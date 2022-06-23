import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'input-fieldarea',
  templateUrl: './input-fieldarea.component.html',
  styleUrls: ['./input-fieldarea.component.css']
})
export class InputFieldareaComponent
{
	constructor() { }

	@Input() name: string = "Empty Name..";
	@Input() placeholder: string = "";
	@Input() label: string = "Empty Label";
	@Input() static: boolean = true;
	@Input() index: number = 0;
	@Input() selfElement!: ElementRef;

	public change_index(value: any): void
	{
		this.selfElement.nativeElement.style.order = value;
	}
}
