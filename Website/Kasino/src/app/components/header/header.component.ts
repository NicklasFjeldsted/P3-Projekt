import { Component, ElementRef, EventEmitter, HostListener, Output, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent
{
  constructor(public authenticationService: AuthenticationService) { }

  @Output() onSideNavToggle: EventEmitter<void> = new EventEmitter<void>();

  emitSideNavToggle(): void {
    this.onSideNavToggle.emit();
  }
}
