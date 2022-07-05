import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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

	@ViewChild('arrow') arrowElement!: ElementRef;
	@ViewChild('menuBtn') menuButtonElement!: ElementRef;

	public isActive: boolean = false;

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

	public get_component_path(input: string | object): string
	{
		let output: string = "Error::InvalidCategory";

		if (typeof input === 'string')
		{
			output = "";
			output += input;
		}

		if (typeof input === 'object')
		{
			output = "";
			for (const pair of Object.entries(input))
			{
				output += pair[ 0 ];

				if (typeof pair[ 1 ] === 'string')
				{
					output += " > " + pair[ 1 ];
				}

				if (typeof pair[ 1 ] === 'object')
				{
					output += " > " + this.get_component_path(pair[ 1 ]);
				}
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

	private convertIterableObject(value: IterableObject): { [ key: string ]: any; } | string
	{
		let output: { [ key: string ]: any; } | string = {};

		for (const child of value.children)
		{
			if (child.children.length <= 0)
			{
				output = child.name;
				break;
			}
			else
			{
				output[ child.name ] = this.convertIterableObject(child);
			}
		}

		return output;
	}

	public open(): void
	{
		this.isActive = !this.isActive;
		this.isActive ? this.arrowElement.nativeElement.classList.add('rotated') : this.arrowElement.nativeElement.classList.remove('rotated');
		this.isActive ? this.menuButtonElement.nativeElement.classList.add('open') : this.menuButtonElement.nativeElement.classList.remove('open');
	}
}

export type JsonObject = { key: string, value: object | string; };
export type IterableObject = { name: string; children: IterableObject[]; };
