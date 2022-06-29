import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  @Output() sidebarToggle = new EventEmitter<void>();

  ngOnInit(): void {
    this.toggle_theme();
  }

  public toggle_theme() {
    var body = document.body.classList.toggle('dark-mode');
  }

  public emit(): void {
    this.sidebarToggle.emit();
  }

}
