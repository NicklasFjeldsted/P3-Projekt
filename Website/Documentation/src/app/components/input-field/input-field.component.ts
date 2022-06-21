import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css']
})
export class InputFieldComponent implements OnInit {

	constructor() { }

	@Input() name: string = "Empty Name..";
	@Input() type: string = "text";
	@Input() placeholder: string = "";
	@Input() label: string = "Empty Label";

  ngOnInit(): void {
  }

}
