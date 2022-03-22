import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { Observable } from 'rxjs';
import { IUser, User } from '../interfaces/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})


export class SignalrService {
  constructor(private http: HttpClient) { }

  hubConnection: signalR.HubConnection;

  public StartConnection(): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(environment.hubURL + "/Blackjack", {
    })
    .build();

    return this.hubConnection
    .start()
    .catch(err => console.log("Error while starting connection" + err))
  }

  public OnDisconnect()
  {
    this.hubConnection
  }

  public GetUser(): Observable<IUser>
  {
    return this.http.get<IUser>(environment.apiURL + "/blackjack/GetUser");
  }

  public SendData(func: string, data: string): void
  {
    this.hubConnection.send(func, data);
  }

  public GetData(func: string): void
  {
    this.hubConnection.send(func);
  }

  public Subscribe(func: string, action: (data: string) => void)
  {
    this.hubConnection.on(func, (data) => action(data));
  }

}
