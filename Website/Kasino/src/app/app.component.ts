import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignalrService } from './services/signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy
{
  constructor(public signalrService: SignalrService) {}

  username = "";

  ngOnInit(): void {
      this.signalrService.StartConnection();

      setTimeout(() => {
        this.signalrService.JoinRoomResponse();
        this.signalrService.GetEmail().subscribe(e=> {
          this.username = e;
          this.signalrService.JoinRoom(e);
        })
      }, 2000)
  }

  ngOnDestroy(): void {
      this.signalrService.hubConnection.off("");
  }
  title = 'Kasino';
}
