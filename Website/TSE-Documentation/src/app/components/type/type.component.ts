import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css']
})
export class TypeComponent implements OnInit {

	constructor() { }

	@Input() typeName: string = "No Name";

  	ngOnInit(): void {
  	}

}
