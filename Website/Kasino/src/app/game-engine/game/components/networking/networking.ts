import * as signalR from "@microsoft/signalr";
import { IFeature, ServerLogger } from "src/app/game-engine/utils";
import { environment } from "src/environments/environment";
import { Game } from "../../game";
import { GameType } from "./gameType";

export class NetworkingFeature implements IFeature
{
	public Entity: Game;

	public hubConnection: signalR.HubConnection;
	private subscriptions: string[] = [];

	constructor(private gameType: GameType) { }

	public async StartConnection(): Promise<void>
	{
		this.hubConnection = new signalR.HubConnectionBuilder()
			.withUrl(environment.hubURL + `/${GameType[this.gameType]}`)
			.configureLogging(new ServerLogger())
			.build();

		try
		{
			return await this.hubConnection.start().then(() => this.SendData("Identify", JSON.stringify(this.Entity.user)));
		}
		catch (error)
		{
			return console.log("Error while starting connection\n\n", error);
		}
	}
  
	public SendData<T>(func: string, data: T): void
	{
	  	this.hubConnection.send(func, data);
	}

	public Send(func: string): void
	{
	  	this.hubConnection.send(func);
	}
  
	public async Subscribe<T>(func: string, action: (data: T) => void): Promise<void>
	{
		return await new Promise((resolve) =>
		{
			this.hubConnection.on(func, (data) => action(data));
			this.subscriptions.push(func);
			resolve();
		});
	}

	public async Unsubscribe(func: string): Promise<void>
	{
		return await new Promise((resolve) =>
		{
			this.hubConnection.off(func);
			console.debug(func + " - Unsubscribed.");
			resolve();
		});
	}

	private counter: number = 0;
	public StopConnection(): Promise<boolean>
	{
		return new Promise<boolean>((resolve, reject) =>
		{
			this.subscriptions.forEach((subscription) =>
			{
				this.Unsubscribe(subscription).then(() =>
				{
					this.counter++;
					if (this.counter == this.subscriptions.length)
					{
						this.hubConnection.stop().then(() =>
						{
							this.counter = 0;
							resolve(true);
						}).catch((error) => { console.error(error); reject(false); });
					}
				});
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

	}
}