import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-udbetal',
  templateUrl: './udbetal.component.html',
  styleUrls: ['./udbetal.component.css']
})
export class UdbetalComponent implements OnInit {

  constructor(public customerService: CustomerService) { }

  ngOnInit(): void { }
}
