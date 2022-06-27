import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.toggle_theme();
  }

  public active: boolean = false;

  public toggle_sidebar(): void
  {
    this.active = !this.active;
  }

  public toggle_theme() {
    var body = document.body.classList.toggle('dark-mode');
  }

}
