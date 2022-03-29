import * as signalR from "@microsoft/signalr";
import { Observable } from "rxjs";
import { IFeature } from "src/app/game-engine/utils";
import { environment } from "src/environments/environment";
import { Game } from "../../game";

export class NetworkingFeature implements IFeature
{
	Entity: Game;

	public hubConnection: signalR.HubConnection;

	public async StartConnection(): Promise<void>
	{
	  this.hubConnection = new signalR.HubConnectionBuilder()
		.withUrl(environment.hubURL + "/Blackjack", {})
		.build();
	  
	  try
	  {
		return await this.hubConnection.start();
	  }
	  catch (err)
	  {
		return console.log("Error while starting connection" + err);
	  }
	}

	public OnDisconnect()
	{
	  this.hubConnection
	}
  
	public SendData(func: string, data: string): void
	{
	  this.hubConnection.send(func, data);
	}
  
	public GetData(func: string): void
	{
	  this.hubConnection.send(func);
	}
  
	public async Subscribe(func: string, action: (data: string) => void): Promise<void>
	{
		return await new Promise((resolve) =>
		{
			this.hubConnection.on(func, (data) => action(data));
			resolve();
		});
	}

	Awake(): void
	{

	}

	Start(): void
	{
		
	}
	
	Update(deltaTime: number): void
	{

	}
}