import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { luhnValidate } from 'ng-luhn-validator';
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
        opacity: 0
      })),
      transition('* => *', animate(400))
    ])
  ]
})

export class IndbetalComponent implements OnInit {
  isOpen: boolean = true;
  submitted: boolean = false;

  @ViewChild("focusBtn") btn: ElementRef;

  form: FormGroup = new FormGroup({
    cardName: new FormControl(''),
    cardNumber: new FormControl(''),
    expDate: new FormControl(''),
    cvv: new FormControl(),
    amount: new FormControl(),
  });

  constructor(private dialogRef: DialogRef, @Inject(DIALOG_DATA) public data: string, private dialogService: DialogService, private builder: FormBuilder) { }

  ngOnInit(): void {
    this.showSearch();
    this.isOpen = true;
    this.form = this.builder.group({
      cardName: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.minLength(19), Validators.maxLength(19)]],
      expDate: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      cvv: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      amount: [null, Validators.required],
    })
  }
  close(): void
  {
    this.isOpen = false;
    this.dialogRef.close();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.isValid(this.f['cardNumber']?.value));
    if(!this.isValid(this.f['cardNumber']?.value) || this.form.invalid) {
      return;
    }

    return;
  }

  updateAmount(value: number): void {
    this.form.patchValue({amount: value});
  }

  isValid(digits: string) {
    let sum = 0;

    for (let i = 0; i < digits.length; i++) {
        let cardNum = parseInt(digits[i]);

        if ((digits.length - i) % 2 === 0) {
            cardNum = cardNum * 2;

            if (cardNum > 9) {
                cardNum = cardNum - 9;
            }
        }

        sum += cardNum;
    }

    return sum % 10 === 0;
  }

  addDashes(): void {
    var ele = this.f['cardNumber'].value;
    ele = ele.split('-').join('');
    console.log("is it dash?")
    let finalVal = ele.match(/.{1,4}/g)?.join('-');
    this.form.patchValue({cardNumber: finalVal});
  }

  addSlash(): void {
    var ele = this.f['expDate'].value;
    console.log("is it slash?")
    ele = ele.split('/').join('');

    let finalVal = ele.match(/.{1,2}/g)?.join('/');
    this.form.patchValue({expDate: finalVal});
  }
  showSearch(){
    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      this.btn.nativeElement.focus();
      this.updateAmount(150);
    },0);
  }
}
