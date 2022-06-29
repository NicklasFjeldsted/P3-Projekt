import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Documentation';

  active: boolean = false;

  height: number = 0;


  public toggle_sidebar(): void
  {
    this.active = !this.active;
  }

}

