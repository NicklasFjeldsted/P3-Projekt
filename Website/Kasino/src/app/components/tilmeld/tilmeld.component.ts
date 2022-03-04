import { Component, } from '@angular/core';


@Component({
  selector: 'app-tilmeld',
  templateUrl: './tilmeld.component.html',
  styleUrls: ['./tilmeld.component.css']
})
export class TilmeldComponent {
  step: any = 1;
  wrongcred: any = false;
  constructor() { }

  goNext() { this.step += 1; }
}
