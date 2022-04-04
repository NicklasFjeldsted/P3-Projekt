import { Subject } from "rxjs";
import { GameObject, MonoBehaviour, TextComponent, Vector3 } from "src/app/game-engine";
import { IUser } from "src/app/interfaces/User";
import { Card } from "../cards";
import { Player, PlayerData } from "../player";
import { Seat } from "../seat";

export class House extends MonoBehaviour
{
	public seats: Seat[] = [];
	public get OccupiedSeats(): Seat[]
	{
		var output: Seat[] = [];
		for (const seat of this.seats)
		{
			if (!seat.Occupied)
				continue;
			
			output.push(seat);
		}
		return output;
	}


	private IsPlaying: boolean = false;
	private SeatTurn: number = -1;

	private childText: TextComponent;
	private houseCards: Card[] = [];
	private get HeldValue(): number
	{
		var output = 0;
		for (const card of this.houseCards)
		{
			output += card.value;
		}
		return output;
	}

	private _client: Player | null = null;
	public get client(): Player
	{
		if (this._client)
		{
			return this._client;
		}
		throw new Error(`${this.gameObject.gameObjectName} > ${this.constructor.name} - player is null!`);
	}

	public static OnDeal: Subject<number> = new Subject<number>();

	Start(): void
	{

	}

	Awake(): void
	{
		this.CreateSeat(1, new Vector3(0, 500, 0));
		for (let i = 1; i < 9; i++)
		{
			this.CreateSeat(i+1, new Vector3(i * 107, 500, 0));
		}

		let cardChild = new GameObject('House Cards');
		this.gameObject.game.Instantiate(cardChild);

		cardChild.AddComponent(new TextComponent());
		this.childText = cardChild.GetComponent(TextComponent);

		cardChild.transform.Translate(new Vector3(450, 50, 0));
		cardChild.SetParent(this.gameObject);

		this.childText.text = ' ';
	}
	
	Update(deltaTime: number): void
	{
		if (this.IsPlaying)
		{
			for (const seat of this.seats)
			{
				if (this.SeatTurn === seat.seatIndex)
				{
					seat.UpdateIsMyTurn(true);
				}
			}
		}
	}

	public override Dispose(): void
	{
		this.seats.splice(0, this.seats.length);
		this._client = null;
		this.gameObject.RemoveComponent(House);
	}

	public SyncPlaying(data: string): void
	{
		this.IsPlaying = JSON.parse(data);
		console.log(this.IsPlaying);
	}
	
	public SyncTurn(data: string): void
	{
		this.SeatTurn = JSON.parse(data);
		console.log(this.SeatTurn);
	}

	public UpdateSeatData(playerDataString: string)
	{
		// Convert the incoming playerDataJsonString to a Json Object and Index it by the connection id.
		var playerData: PlayerData[] = JSON.parse(playerDataString);

		for (const key in playerData)
		{
			for (const seat of this.seats)
			{
				this.ShouldReset(playerData, seat).then((result) =>
				{
					if (result)
					{
						seat.ResetSeat();
					}
					else if (!result && seat.seatIndex === playerData[ key ].seatIndex)
					{
						seat.UpdateSeat(playerData[key]);
					}
				})
				.finally(() =>
				{
					seat.Display();
				});
			}
		}
	}

	private async ShouldReset(data: PlayerData[], seat: Seat): Promise<boolean>
	{
		return await new Promise<boolean>((resolve) =>
		{
			for (const key in data)
			{
				if (seat.seatIndex == data[ key ].seatIndex)
				{
					return resolve(false);
				}
			}
			return resolve(true);
		});
	}

	public CreateClient(user: IUser)
	{
		this._client = new Player();
		this.client.data.email = user.email;
		this.client.data.fullName = user.fullName;
		Player.OnDataChanged.next(this.client.data);
	}

	private CreateSeat(id: number, position: Vector3): GameObject
	{
		let seat: GameObject = new GameObject(`Seat - ${id}`);
		this.gameObject.game.Instantiate(seat);
		seat.SetParent(this.gameObject);
		seat.AddComponent(new Seat());
		seat.GetComponent(Seat).seatIndex = id;
		seat.transform.position = position;
		this.seats.push(seat.GetComponent(Seat));
		return seat;
	}

	public HouseCards(data: string): void
	{
		this.houseCards.push(JSON.parse(data));
		this.childText.text = this.HeldValue.toString();
	}

	private HouseReveal(): void
	{
		
	}
}