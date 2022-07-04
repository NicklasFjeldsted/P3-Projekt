import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IterableObject } from '../input-fieldmenu.component';

@Component({
  selector: 'menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent
{
  	constructor() { }

	@Input() item!: IterableObject;
	@Output() onPassValueUp: EventEmitter<IterableObject> = new EventEmitter<IterableObject>();

	public passValueUp(incommingValue: IterableObject): void
	{
		if (!this.item.children.includes(incommingValue))
		{
			this.onPassValueUp.emit(incommingValue);
		}
		else
		{
			this.onPassValueUp.emit(this.item);
		}
	}
}
