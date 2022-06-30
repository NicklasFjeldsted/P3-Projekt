import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  @Output() sidebarToggle = new EventEmitter<void>();

  darkmodeActive: boolean = true;

  ngOnInit(): void {
    this.toggle_theme();
  }



  public toggle_theme() {
    var body = document.body.classList.toggle('dark-mode');
    this.darkmodeActive = !this.darkmodeActive;
  }

  public emit(): void {
    this.sidebarToggle.emit();
  }

}
