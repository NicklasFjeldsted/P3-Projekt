import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  animations: [
    trigger('openSidenav', [
      state('open', style({
        left: '0'
      })),
      state('closed', style({
        left: '-250px'
      })),
      transition('open => closed', [
        animate('0.2s ease')
      ]),
      transition('closed => open', [
        animate('0.2s ease')
      ])
    ])
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit
{
  constructor(private router: Router) {}
  faCoffee = faCoffee;
  title = 'Kasino';

  isSidenavOpen = false;

  sideNav: HTMLElement;
  backDrop: HTMLElement;

  ngOnInit(): void {
    this.sideNav = document.getElementById('sideNav')!;
    this.backDrop = document.getElementById('backdrop')!;
  }

  closeSideNav(): void {
    if(this.sideNav.classList.contains('active'))
    {
      this.isSidenavOpen = !this.isSidenavOpen;
      this.sideNav.classList.remove('active');
      this.backDrop.classList.remove('active');
    }
  }

  openSideNav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
    this.sideNav.classList.add('active');
    this.backDrop.classList.add('active');
  }

  goToLink(site: string) {
    this.router.navigate([site]);
  }
}
