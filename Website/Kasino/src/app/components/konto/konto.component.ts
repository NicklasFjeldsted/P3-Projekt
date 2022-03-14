import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CustomerService } from '../../services/customer.service';


@Component({
  selector: 'app-konto',
  templateUrl: './konto.component.html',
  styleUrls: ['./konto.component.css']
})
export class KontoComponent implements OnInit {

  constructor(public customerService: CustomerService) { }

  // constructor(private http: HttpClient) { }

  ngOnInit(): void {}

}
