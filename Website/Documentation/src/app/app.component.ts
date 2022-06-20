import { Component, OnInit } from '@angular/core';
import { DropdownElement } from './components/dropdown/dropdown.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Documentation';
  mand: DropdownElement[] = [];
  ngOnInit(): void {
    this.mand[0] = new DropdownElement();
    this.mand[0] = { title: 'Mand', content: null };
  }
}
