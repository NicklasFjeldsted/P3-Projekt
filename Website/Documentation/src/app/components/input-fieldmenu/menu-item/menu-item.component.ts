import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { IterableObject } from '../input-fieldmenu.component';

@Component({
  selector: 'menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent
{
  	constructor(private elementRef: ElementRef) { }

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

	public openMenu(): void
	{
		this.elementRef.nativeElement.classList.contains('expanded') ? this.elementRef.nativeElement.classList.remove('expanded') : this.elementRef.nativeElement.classList.add('expanded');
	}
}
