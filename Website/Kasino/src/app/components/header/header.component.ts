import { Component, ElementRef, HostListener, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  host: {
    '(document:click)': 'onclick($event)',
  },
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent
{
  constructor(public authenticationService: AuthenticationService) { }

}



