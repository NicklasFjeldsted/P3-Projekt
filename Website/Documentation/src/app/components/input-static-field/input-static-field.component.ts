import { Component, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'input-static-field',
  templateUrl: './input-static-field.component.html',
  styleUrls: ['./input-static-field.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class InputStaticFieldComponent {

  constructor() { }

	@Input() name: string = "Empty Name..";
	@Input() type: string = "text";
	@Input() placeholder: string = "";
	@Input() label: string = "Empty Label";
}
