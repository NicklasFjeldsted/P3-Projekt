import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root'
})


export class SignalrService {

  URL:string = "https://localhost:5001/api/Blackjack/";

  constructor(private http: HttpClient, private jwt: JwtHelperService) { }

  hubConnection:signalR.HubConnection;

  StartConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:5001/Blackjack", {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
    })
    .build();

    this.hubConnection
    .start()
    .then(() => {
      console.log("Hub connection started!");
    })
    .catch(err => console.log("Error while starting connection" + err))
  }

  GetUser(): Observable<User>
  {
    return this.http.get<User>(this.URL + "GetUser");
  }

}