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
  
	public SendData(func: string, data: string): void
	{
	  this.hubConnection!.send(func, data);
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

	public async StopConnection(): Promise<void>
	{
		try
		{
			return await this.hubConnection!.stop();
		}
		catch (error)
		{
			return console.error("Error while stopping connection" + error);
		}
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
		this.Entity.RemoveFeature(NetworkingFeature);
	}
}