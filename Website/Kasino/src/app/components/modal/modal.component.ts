import { state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  animations: [
    trigger('openIndbetalForm', [
      state('open', style({

      })),
      state('closed', style({

      })),
      transition('open => closed', [

      ]),
      transition('closed => open', [

      ])
    ])
  ]
})

export class ModalComponent implements OnInit {

  constructor() { }

  indbetalForm: HTMLElement;

  isIndbetalFormOpen: boolean = false;

  ngOnInit(): void {
    this.indbetalForm = document.getElementById('indbetalForm')!;
  }

}
