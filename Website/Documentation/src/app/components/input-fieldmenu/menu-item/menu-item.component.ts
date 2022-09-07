import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
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
	@ViewChild('arrow') arrowElement!: ElementRef;
	@ViewChild('newOptionInput') inputElement!: ElementRef;

	public isActive: boolean = false;
	public isAddActive: boolean = false;

	public passValueUp(incommingValue: IterableObject): void
	{
		if (this.item !== incommingValue)
		{
			console.log(this.item.name + " - This is not me, send myself with only the incomming as my child.");
			let toSend: IterableObject = Object.create(this.item);
			toSend.children = [];
			toSend.children[ 0 ] = incommingValue;
			this.onPassValueUp.emit(toSend);
		}
		else
		{
			console.log(this.item.name + " - This is me, send myself without children.");
			let toSend: IterableObject = Object.create(this.item);
			toSend.children = [];
			this.onPassValueUp.emit(toSend);
		}
	}

	public openMenu(): void
	{
		this.isActive = !this.isActive;
		this.isActive ? this.arrowElement.nativeElement.classList.add('rotated') : this.arrowElement.nativeElement.classList.remove('rotated');
	}

	public openAddOption(): void
	{
		this.isAddActive = !this.isAddActive;
	}

	public cancel(): void
	{
		this.isAddActive = false;
	}

	public confirm(): void
	{
		this.isActive = false;
		this.isAddActive = false;

		let newItem: IterableObject = { name: this.inputElement.nativeElement.value, children: [] }

		this.item.children.push(newItem);
		this.passValueUp(newItem);
	}
}
