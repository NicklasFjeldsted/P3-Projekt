import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import data from '../../../assets/data/sidebar-content.json';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

	constructor() { }

	public data: object = data;

	@Input() open!: boolean;

	@Output() output: EventEmitter<void> = new EventEmitter<void>();

	ngOnInit(): void
	{

	}

	public Emit(): void
	{
		this.output.emit();
	}

}
