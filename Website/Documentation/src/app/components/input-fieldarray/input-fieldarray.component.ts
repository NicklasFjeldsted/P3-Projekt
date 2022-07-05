import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'input-fieldarray',
  templateUrl: './input-fieldarray.component.html',
  styleUrls: ['./input-fieldarray.component.css']
})
export class InputFieldarrayComponent implements OnInit
{
	constructor() { }

	@Input() array!: FormArray;
	@Input() name: string = "Empty Name..";
	@Input() placeholder: string = "";
	@Input() label: string = "Empty Label";
	@Input() seperator: string = ",";
	@ViewChild('arrayInput') inputElement!: ElementRef;

	ngOnInit(): void {
	}

	public updateArray(): void
	{
		let elements: string[] = this.inputElement.nativeElement.value.split(this.seperator);
		this.array.clear();
		for (const element of elements)
		{
			if (element === '')
			{
				continue;
			}
			this.array.push(new FormControl(element));
		}
	}

}
