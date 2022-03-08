import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { Observable } from 'rxjs';
import { User } from '../interfaces/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})


export class SignalrService {
  constructor(private http: HttpClient) { }


  hubConnection:signalR.HubConnection;

  StartConnection(): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(environment.hubURL + "Blackjack", {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
    })
    .build();

    return this.hubConnection
    .start()
    .then(() => {
      console.log("Hub connection started!");

    })
    .catch(err => console.log("Error while starting connection" + err))
  }

  GetUser(): Observable<User>
  {
    return this.http.get<User>(environment.apiURL + "blackjack/GetUser");
  }

}
