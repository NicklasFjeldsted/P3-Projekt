import { Component, Injectable, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/User';
import { SignalrService } from 'src/app/services/signalr.service';


@Component({
  selector: 'app-blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css']
})

@Injectable({ providedIn: 'root' })

export class BlackjackComponent implements OnInit {

  constructor(public signalrService: SignalrService) {}

  messages: string[] = [];
  author: string;

  ngOnInit(): void {
      this.signalrService.StartConnection().then(() => {
        this.signalrService.GetUser().subscribe(user => this.JoinRoom(user));
      }); // Starts connection

      this.signalrService.hubConnection.on("JoinRoomResponse", (user) => this.OnJoinRoom(JSON.parse(user)));
      this.signalrService.hubConnection.on("ReceiveMessage", (author, message) => this.ReceiveMessage(author, message));
  }

  JoinRoom(user: User): void {
    this.author = user.fullName;
    this.signalrService.hubConnection.invoke("JoinRoom", JSON.stringify(user)).catch(error => console.log(error));
  }

  OnJoinRoom(user: User): void {
    console.log("hello" + user.fullName);
    this.SendMessage("Server", user.fullName + " has joined!")
  }

  SendMessage(author: string, message: string): void {
    this.signalrService.hubConnection.invoke("SendMessage", author, message)
      .catch(error => console.error(error));
  }

  ReceiveMessage(author: string, message: string)
  {
    this.messages.push(author + ": " + message);
  }



  onKeydown(event: any): void{
    event.preventDefault();
  }


}
