import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  amount: number;
  form: FormGroup;

  constructor(private builder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.builder.group({
      cardName: [],
      cardNumber: [],
      expDate: [],
      cvv: [],
      amount: [],
    })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

}
