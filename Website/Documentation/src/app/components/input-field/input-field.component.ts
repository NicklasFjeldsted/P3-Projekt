import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css']
})
export class InputFieldComponent
{
	constructor() { }

	@Input() name: string = "Empty Name..";
	@Input() type: string = "text";
	@Input() placeholder: string = "";
	@Input() label: string = "Empty Label";
	@Input() static: boolean = true;
	@Input() index: number = 0;
	@Input() selfElement!: ElementRef;

	public index_changed(value: any): void
	{
		this.selfElement.nativeElement.style.order = value;
	}
}
