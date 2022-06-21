import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'input-fieldarea',
  templateUrl: './input-fieldarea.component.html',
  styleUrls: ['./input-fieldarea.component.css']
})
export class InputFieldareaComponent implements OnInit {

	constructor() { }

	@Input() name: string = "Empty Name..";
	@Input() placeholder: string = "";
	@Input() label: string = "Empty Label";

	ngOnInit(): void {
	}

}
