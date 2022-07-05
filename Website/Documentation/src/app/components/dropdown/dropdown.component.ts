import { Component, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {

	constructor(private router: Router) {}

	@Input() data!: object;
	@Output() onNavigate: EventEmitter<void> = new EventEmitter<void>();

	public content: Map<string, any> = new Map<string, any>();

	ngOnInit(): void
	{
		for (const entry of Object.entries(this.data))
		{
			this.content.set(entry[ 0 ], entry[ 1 ]);
		}
	}

	/**
	 * Takes a string and makes into an id.
	 * @param value string
	 * @returns string
	 */
	public get_id(value: string): string
	{
		return value.toLowerCase().replace(' ', '-');
	}

	/**
	 * Expands a dropdown menu.
	 * @param elementID string
	 */
	public expand_dropdown(elementID: string): void
	{
		let buttonElement = document.getElementById(elementID)!;
		let elements = document.getElementsByTagName('dropdown');


		buttonElement.classList.contains('expanded') ? buttonElement.classList.remove('expanded') : buttonElement.classList.add('expanded');

		for (let i = 0; i < elements.length; i++)
		{
			if (elements.item(i)!.id !== elementID) continue;

			elements.item(i)!.classList.contains('expanded') ? elements.item(i)!.classList.remove('expanded') : elements.item(i)!.classList.add('expanded');
			let el = <HTMLElement>elements.item(i)!;
			for(let i = 0; i < el.children.length; i++) {
				let child = <HTMLElement>el.children.item(i)?.children.item(i)?.children.item(i)!;
				child.style.paddingLeft = "2rem";
			}
		}
	}

	public open_article(article_path: string): void
	{
		this.router.navigate([ `/article` ], { queryParams: { title: article_path } });
		this.onNavigate.emit();
	}

	/**
	 * Returns the type of the value.
	 * @param value any
	 * @returns type in string format
	 */
	public type_of(value: any): "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"
	{
		return typeof value;
	}

	public return_zero = () => 0;
}
