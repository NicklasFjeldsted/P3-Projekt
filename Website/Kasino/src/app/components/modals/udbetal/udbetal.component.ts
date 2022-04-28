import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BalanceService } from 'src/app/services/balance.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { Broadcast } from '../../header/broadcast';
import { DialogRef } from '../dialog-ref';
import { DIALOG_DATA } from '../dialog-tokens';

@Component({
  selector: 'app-udbetal',
  templateUrl: './udbetal.component.html',
  styleUrls: ['./udbetal.component.css'],
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
export class UdbetalComponent implements OnInit 
{

  isOpen: boolean = true;
  submitted: boolean = false;
  isCardValid: boolean = true;
  currentBalance: number | null;

  @ViewChild("focusBtn") btn: ElementRef;

  form: FormGroup = new FormGroup({
    cardName: new FormControl(''),
    cardNumber: new FormControl(''),
    expDate: new FormControl(''),
    cvv: new FormControl(),
    amount: new FormControl(),
  });

  constructor(private dialogRef: DialogRef, @Inject(DIALOG_DATA) public data: string, private router: Router, private builder: FormBuilder, private balance: BalanceService, private authenticationService: AuthenticationService, private transaction: TransactionService) { }

  ngOnInit(): void 
  {
    Broadcast.Instance.onBalanceChange.subscribe(event => this.getBalance());
    this.getBalance();
    this.showFocus();
    this.isOpen = true;

    // Gives form validators
    this.form = this.builder.group({
      cardName: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.minLength(19), Validators.maxLength(19)]],
      expDate: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      cvv: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      amount: [null, Validators.required],
    })
  }

  // Closes dialog(modal)
  close(): void 
  {
    this.isOpen = false;
    this.dialogRef.close();
  }

  // Gets controls from form
  get f(): { [key: string]: AbstractControl } 
  {
    return this.form.controls;
  }

  // Submits the deposit request
  onSubmit() 
  {
    this.submitted = true;
    if(this.form.invalid) 
    {
      if(!this.isValid()) 
      {
        this.isCardValid = false;
        return;
      }
      this.isCardValid = true;
      return;
    }

    this.balance.subtractBalance(this.f['amount']?.value).subscribe({
      next: (response) => {
        this.transaction.AddTransaction(response).subscribe({
          next: (message) => {
            console.log(message);
            this.close();
            window.location.reload();
          }
        })
      },
      error: (error) => 
      {
        console.log(error);
      }
    })
    return;
  }

  // Updates the amount value to the specified buttons value
  updateAmount(value: number | null): void 
  {
    this.form.patchValue({amount: value});
  }

  // Checks if the card number is valid through the use of Luhn algorithm
  isValid() 
  {
    let digits:string = this.f['cardNumber']?.value.split('-').join('');
    if (/[^0-9-\s]+/.test(digits)) return false;

    var nCheck = 0, nDigit = 0, bEven = false;
    digits = digits.replace(/\D/g, "");

    for (var n = digits.length - 1; n >= 0; n--) 
    {
        var cDigit = digits.charAt(n),
            nDigit = parseInt(cDigit, 10);

        if (bEven) 
        {
            if ((nDigit *= 2) > 9) nDigit -= 9;
        }

        nCheck += nDigit;
        bEven = !bEven;
    }
    return (nCheck % 10) == 0;
  }

  // Adds dashes in between every fourth digit
  addDashes(): void 
  {
    var ele = this.f['cardNumber'].value;
    if(ele === undefined) 
    {
      return
    }

    ele = ele.split('-').join('');
    let finalVal = ele.match(/.{1,4}/g)?.join('-');
    this.form.patchValue({cardNumber: finalVal});
  }

  // Add a slash in between month and year
  addSlash(): void {
    var ele = this.f['expDate']?.value;
    if(ele === undefined) {
      return
    }
    ele = ele.split('/').join('');

    let finalVal = ele.match(/.{1,2}/g)?.join('/');
    this.form.patchValue({expDate: finalVal});
  }

  // Focuces one of the buttons and adds its value to amount
  showFocus()
  {
    setTimeout(()=>
    { // this will make the execution after the above boolean has changed
      this.btn.nativeElement.focus();
      this.updateAmount(50);
    },0);
  }

  // Checks if user presses letters instead of digits
  keyPressNumbers(event: any) 
  {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) 
    {
      event.preventDefault();
      return false;
    } 
    else 
    {
      return true;
    }
  }

  getBalance(): void 
  {
    this.authenticationService.decodeToken().subscribe({
      next: (userBalance) => 
      {
        this.currentBalance = userBalance.balance;
        console.log(this.currentBalance);
      },
      error: (error) => 
      {
        console.log(error)
      }
    })
  }
}
