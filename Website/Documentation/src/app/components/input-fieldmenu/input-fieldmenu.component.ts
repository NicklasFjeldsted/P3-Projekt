import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import data from '../../../assets/data/sidebar-content.json';

@Component({
  selector: 'input-fieldmenu',
  templateUrl: './input-fieldmenu.component.html',
  styleUrls: ['./input-fieldmenu.component.css']
})
export class InputFieldmenuComponent implements OnInit
{
	constructor() { }

	@Input() group!: FormGroup;

	@Input() placeholder: string = "Empty Placeholder..";
	@Input() label: string = "Empty Label";
	@Input() name: string = "Empty Name";

	public selected: string = "";

	public categories: IterableObject[] = [];

	ngOnInit(): void
	{
		for (const property of Object.entries(data))
		{
			if (typeof property[ 1 ] === 'string')
			{
				continue;
			}

			this.categories.push(this.setMenu({ key: property[ 0 ], value: property[ 1 ] }));
		}
	}

	private setMenu(obj: JsonObject): IterableObject
	{
		let output: IterableObject = { name: obj.key, children: [] };

		if (typeof obj.value === 'object')
		{
			for (const property of Object.entries(obj.value))
			{
				if (typeof property[ 1 ] === 'string')
				{
					continue;
				}

				output.children.push(this.setMenu({ key: property[ 0 ], value: property[ 1 ] }));
			}
		}

		return output;
	}

	public receiveValue(value: IterableObject): void
	{
		let convertedValue: { [ key: string ]: any; } | string = {};
		if (value.children.length > 0)
		{
			convertedValue[ value.name ] = this.convertIterableObject(value);
		}
		else
		{
			convertedValue = value.name;
		}
		this.group.get('category')?.setValue(convertedValue);
	}

	private convertIterableObject(value: IterableObject): { [ key: string ]: any; }
	{
		let output: { [ key: string ]: any; } = {};

		for (const child of value.children)
		{
			if (child.children.length <= 0)
			{
				output[ child.name ] = child.name;
				continue;
			}
			output[ child.name ] = this.convertIterableObject(child);
		}

		return output;
	}
}

export type JsonObject = { key: string, value: object | string; };
export type IterableObject = { name: string; children: IterableObject[]; };
