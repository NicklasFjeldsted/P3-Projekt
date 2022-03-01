import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class SignalrService {

  URL:string = "https://localhost:5001/api/customers/";

  constructor(private http: HttpClient) { }


  hubConnection:signalR.HubConnection;

  StartConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:5001/blackjack", {
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

  JoinRoom(username:string): void {
    console.log(this.GetEmail())
    this.hubConnection.invoke("JoinRoom", username, "Hej med dig")
    .catch(err => console.log(err))
  }

  JoinRoomResponse(): void {
    this.hubConnection.on("JoinRoomResponse", (message) => {
      console.log(message);
    })
  }

  GetEmail() {
    return this.http.get<string>(this.URL + "GetEmail");
  }

}