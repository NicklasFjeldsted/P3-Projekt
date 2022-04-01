import { trigger, style, animate, transition, state } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DialogRef } from '../dialog-ref';

@Component({
  selector: 'app-deaktiver',
  templateUrl: './deaktiver.component.html',
  styleUrls: ['./deaktiver.component.css'],
  animations: [
    trigger('openClose', [
      state('open', style({
        opacity: 1,

      })),
      state('closed', style({
        opacity: 0
      })),
      transition('* => *', animate(400))
    ])
  ]
})

export class DeaktiverComponent implements OnInit {

  isOpen: boolean = true;
  constructor(private dialogRef: DialogRef, public authenticationService: AuthenticationService) { }

  ngOnInit(): void 
  {
    this.isOpen = true;
  }

  deaktiver(): void {
    this.isOpen = false;
    this.dialogRef.close();
    this.authenticationService.logout();
  }

  close(): void {
    this.isOpen = false;
    this.dialogRef.close();
  }
}
