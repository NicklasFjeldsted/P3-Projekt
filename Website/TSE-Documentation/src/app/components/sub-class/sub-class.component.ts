import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sub-class',
  templateUrl: './sub-class.component.html',
  styleUrls: ['./sub-class.component.css']
})
export class SubClassComponent implements OnInit {

	constructor() { }

	@Input() subClassName: string = "No Name";

  	ngOnInit(): void {
  	}

}
