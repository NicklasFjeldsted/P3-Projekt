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

	public categories: string[] = [];

	public isActive: boolean = false;

	ngOnInit(): void
	{
		for (const category of Object.keys(data))
		{
			this.categories.push(category);
		}
	}

	public set_selected(value: string): void
	{
		this.selected = value;
		this.group.get(this.name)?.setValue(this.selected);
		this.toggle();
	}

	public add_new_category(value: string): void
	{
		if (value === '')
		{
			return;
		}

		this.set_selected(value);
	}

	public toggle(): void
	{
		const element = document.getElementById('input-fieldmenu');
		if (element?.classList.contains('expanded'))
		{
			element.classList.remove('expanded');
			this.isActive = false;
		}
		else
		{
			element?.classList.add('expanded');
			this.isActive = true;
		}
	}
}
