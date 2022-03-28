import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { delay, first, Subscription, take } from 'rxjs';
import { DialogRef } from '../dialog-ref';
import { DIALOG_DATA } from '../dialog-tokens';
import { DialogService } from '../dialog.service';

@Component({
  selector: 'app-indbetal',
  templateUrl: './indbetal.component.html',
  styleUrls: ['./indbetal.component.css'],
  animations: [
    trigger('openClose', [
      state('open', style({
        opacity: 1,

      })),
      state('closed', style({
        opacity: 0,
        width: '100%'
      })),
      transition('* => *', animate(500))
    ])
  ]
})

export class IndbetalComponent implements OnInit {
  isOpen: boolean = true;
  amount: number;
  form: FormGroup;

  constructor(private dialogRef: DialogRef, @Inject(DIALOG_DATA) public data: string, private dialogService: DialogService, private builder: FormBuilder) { }

  ngOnInit(): void {
    this.isOpen = true;
    this.form = this.builder.group({
      cardName: [],
      cardNumber: [],
      expDate: [],
      cvv: [],
      amount: [],
    })
  }
  close(): void
  {
    this.isOpen = false;
    setTimeout(() => {this.dialogRef.close()}, 500);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
