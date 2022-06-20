import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

export class DropdownElement {
  constructor() {}

  public title!: string;
  public content!: DropdownElement[] | string;
}

@Component({
  selector: 'dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
})
export class DropdownComponent implements AfterViewInit {
  constructor() {}

  @Input() title: string = 'title';
  @Input() dropdownElements: DropdownElement[] | string = [];

  private element!: HTMLElement;

  public get elementID(): string {
    return this.title.toLowerCase().replace(' ', '-');
  }

  ngAfterViewInit(): void {
    this.element = document.getElementById(this.elementID)!;
  }

  public toggleDropdown(): void {
    if (this.element.classList.contains('expanded')) {
      this.element.classList.remove('expanded');
    } else {
      this.element.classList.add('expanded');
    }
  }

  typeOf(value: any) {
    return typeof value;
  }
}
