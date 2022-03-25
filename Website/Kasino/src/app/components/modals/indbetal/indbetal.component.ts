import { Component, Inject } from '@angular/core';
import { DialogRef } from '../dialog-ref';
import { DIALOG_DATA } from '../dialog-tokens';

@Component({
  selector: 'app-indbetal',
  templateUrl: './indbetal.component.html',
  styleUrls: ['./indbetal.component.css']
})

export class IndbetalComponent {

  constructor(private dialogRef: DialogRef, @Inject(DIALOG_DATA) public data: string) { }


  close(): void {
    this.dialogRef.close();
  }
}
