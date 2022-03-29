import { Component, Inject } from '@angular/core';
import { DialogRef } from '../dialog-ref';
import { DIALOG_DATA } from '../dialog-tokens';

@Component({
  selector: 'app-udbetal',
  templateUrl: './udbetal.component.html',
  styleUrls: ['./udbetal.component.css']
})
export class UdbetalComponent {

  constructor(private dialogRef: DialogRef, @Inject(DIALOG_DATA) public data: string) { }

  close(): void {
    this.dialogRef.close();
  }
}
