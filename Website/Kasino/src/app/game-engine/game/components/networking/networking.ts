import * as signalR from "@microsoft/signalr";
import { IFeature, ServerLogger } from "src/app/game-engine/utils";
import { environment } from "src/environments/environment";
import { Game } from "../../game";

export class NetworkingFeature implements IFeature
{
	public Entity: Game;

	public hubConnection: signalR.HubConnection | null;

	public async StartConnection(): Promise<void>
	{
	  this.hubConnection = new signalR.HubConnectionBuilder()
		.withUrl(environment.hubURL + "/Blackjack", {})
		.configureLogging(new ServerLogger())
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
  
	public SendData<T>(func: string, data: T): void
	{
	  this.hubConnection!.send(func, data);
	}
	public Send(func: string): void
	{
	  this.hubConnection!.send(func);
	}
  
	public GetData(func: string): void
	{
	  this.hubConnection!.send(func);
	}
  
	public async Subscribe(func: string, action: (data: string) => void): Promise<void>
	{
		return await new Promise((resolve) =>
		{
			this.hubConnection!.on(func, (data) => action(data));
			resolve();
		});
	}

	public async Unsubscribe(func: string): Promise<void>
	{
		return await new Promise((resolve) =>
		{
			this.hubConnection!.off(func);
			resolve();
		});
	}

	public StopConnection(): Promise<boolean>
	{
		return new Promise<boolean>((resolve) =>
		{
			this.hubConnection!.stop().then(() =>
			{
				resolve(true);
			});
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

	Dispose(): void
	{
		console.error(`${this.constructor.name} - Disposed`);
		this.hubConnection = null;
		this.Entity.RemoveFeature(NetworkingFeature);
	}
}