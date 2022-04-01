import { Subject } from "rxjs";
import { GameObject, MonoBehaviour, TextComponent, Vector3 } from "src/app/game-engine";
import { Card } from "../cards";
import { Player, PlayerData } from "../player";
import { Seat } from "../seat";

export class House extends MonoBehaviour
{
	private static _instance: House;
	public static get Instance()
	{
		if (!House._instance)
		{
			House._instance = new House();
		}

		return House._instance;
	}

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


	private IsPlaying: boolean;
	private SeatTurn: number;

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

	public _localPlayer: Player;

	constructor()
	{
		super();
		this.CreateSeat(1, new Vector3(0, 500, 0));
		for (let i = 1; i < 9; i++)
		{
			this.CreateSeat(i+1, new Vector3(i * 107, 500, 0));
		}
	}

	public static OnDeal: Subject<number> = new Subject<number>();

	Start(): void
	{

	}

	Awake(): void
	{
		let cardChild = new GameObject('House Cards');
		cardChild.AddComponent(new TextComponent());
		this.childText = cardChild.GetComponent(TextComponent);
		cardChild.transform.Translate(new Vector3(450, 50, 0));
		cardChild.SetParent(this.gameObject);
		this.childText.text = ' ';
	}
	
	Update(deltaTime: number): void
	{

	}

	public SyncPlaying(data: string): void
	{
		this.IsPlaying = JSON.parse(data).IsPlaying;
	}

	public SyncTurn(data: string): void
	{
		this.SeatTurn = JSON.parse(data).SeatTurnIndex;
	}

	public UpdateSeats(playerDataString: string)
	{
		// The changes that happen to seats with a key of the connection id.
		var playerData: PlayerData[] = JSON.parse(playerDataString);
		for (const key in playerData)
		{
			if (playerData.hasOwnProperty(key))
			{
				for (const seat of this.seats)
				{
					if (seat.seatIndex === playerData[ key ].seatIndex)
					{
						seat.UpdateSeat(playerData[ key ]);
					}

					if (seat.seatIndex != playerData[key].seatIndex)
					{
						seat.ResetSeat();
					}

					if (!this._localPlayer)
					{
						if (seat.Occupied)
						{
							seat.gameObject.isActive = false;
						}
					}
					else
					{
						if (seat.Occupied)
						{
							seat.gameObject.isActive = true;
						}
					}
				}
			}
		}
	}

	private CreateSeat(id: number, position: Vector3): GameObject
	{
		let seat: GameObject = new GameObject(`Seat - ${id}`);
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