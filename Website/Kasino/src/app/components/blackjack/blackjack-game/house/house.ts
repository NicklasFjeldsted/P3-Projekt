import { Subject } from "rxjs";
import { GameObject, MonoBehaviour, TextComponent, Vector3 } from "src/app/game-engine";
import { Card } from "../cards";
import { Player } from "../player";
import { ISeat, Seat } from "../seat";

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

	public AllCards: Card[] = [
		new Card(1, 1, 'ACE of Hearts'),
		new Card(2, 1, 'ACE of Spades'),
		new Card(3, 1, 'ACE of Cloves'),
		new Card(4, 1, 'ACE of Diamonds'),
		new Card(5, 2, '2 of Hearts'),
		new Card(6, 2, '2 of Spades'),
		new Card(7, 2, '2 of Cloves'),
		new Card(8, 2, '2 of Diamonds'),
		new Card(9, 3, '3 of Hearts'),
		new Card(10, 3, '3 of Spades'),
		new Card(11, 3, '3 of Cloves'),
		new Card(12, 3, '3 of Diamonds'),
		new Card(13, 4, '4 of Hearts'),
		new Card(14, 4, '4 of Spades'),
		new Card(15, 4, '4 of Cloves'),
		new Card(16, 4, '4 of Diamonds'),
		new Card(17, 5, '5 of Hearts'),
		new Card(18, 5, '5 of Spades'),
		new Card(19, 5, '5 of Cloves'),
		new Card(20, 5, '5 of Diamonds'),
		new Card(21, 6, '6 of Hearts'),
		new Card(22, 6, '6 of Spades'),
		new Card(23, 6, '6 of Cloves'),
		new Card(24, 6, '6 of Diamonds'),
		new Card(25, 7, '7 of Hearts'),
		new Card(26, 7, '7 of Spades'),
		new Card(27, 7, '7 of Cloves'),
		new Card(28, 7, '7 of Diamonds'),
		new Card(29, 8, '8 of Hearts'),
		new Card(30, 8, '8 of Spades'),
		new Card(31, 8, '8 of Cloves'),
		new Card(32, 8, '8 of Diamonds'),
		new Card(33, 9, '9 of Hearts'),
		new Card(34, 9, '9 of Spades'),
		new Card(35, 9, '9 of Cloves'),
		new Card(36, 9, '9 of Diamonds'),
		new Card(37, 10, '10 of Hearts'),
		new Card(38, 10, '10 of Spades'),
		new Card(39, 10, '10 of Cloves'),
		new Card(40, 10, '10 of Diamonds'),
		new Card(41, 10, 'J of Hearts'),
		new Card(42, 10, 'J of Spades'),
		new Card(43, 10, 'J of Cloves'),
		new Card(44, 10, 'J of Diamonds'),
		new Card(45, 10, 'Q of Hearts'),
		new Card(46, 10, 'Q of Spades'),
		new Card(47, 10, 'Q of Cloves'),
		new Card(48, 10, 'Q of Diamonds'),
		new Card(49, 10, 'K of Hearts'),
		new Card(50, 10, 'K of Spades'),
		new Card(51, 10, 'K of Cloves'),
		new Card(52, 10, 'K of Diamonds')
	];

	private availableCards: Card[] = [];
	public seats: Seat[] = [];
	public occupiedSeats: Seat[] = [];

	public TimeBetweenRounds: number = 5;
	private currentTimeBetweenRounds: number;
	private IsPlaying: boolean;

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
		this.currentTimeBetweenRounds = this.TimeBetweenRounds;
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
		if (this.currentTimeBetweenRounds <= 0)
		{
			this.currentTimeBetweenRounds = this.TimeBetweenRounds;
			if (this.IsPlaying)
			{
				console.log("New Round? - No");
				return;
			}
			
			if (!this.CheckPlayers())
			{
				console.log("There are no players.");
				return;
			}
			
			console.log("New Round? - Yes");
			this.StartNewRound();
		}
		else
		{
			this.currentTimeBetweenRounds -= deltaTime;
		}
	}

	public UpdateSeats(seatData: string)
	{
		var newSeats = JSON.parse(seatData);
		for (const key in newSeats)
		{
			if (newSeats.hasOwnProperty(key))
			{
				for (const seat of this.seats)
				{
					if (seat.seatIndex === newSeats[ key ].seatIndex)
					{
						seat.Occupied = true;
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

	private CheckPlayers(): boolean
	{
		for (const seat of this.seats)
		{
			if (seat.Occupied)
			{
				return true;
			}
		}
		return false;
	}

	private StartNewRound(): void
	{
		this.IsPlaying = true;
		for (let i = 0; i < this.AllCards.length; i++)
		{
			this.availableCards[ i ] = this.AllCards[ i ];
		}
		this.DealCards().then(e => this.DealCards());
	}

	private EndRound(): void
	{
		this.IsPlaying = false;
	}

	private GetCard(): Card
	{
		if (this.availableCards.length <= 0)
		{
			throw new Error(`There is no more cards left.`);
		}

		var cardIndex: number;;
		
		cardIndex = Math.floor(Math.random() * this.availableCards.length);

		let card: Card = this.availableCards[ cardIndex ];

		this.availableCards.splice(cardIndex, 1);

		return card;
	}

	public async DealCards(): Promise<void>
	{
		return await new Promise((resolve) =>
		{
			for (const seat of this.seats)
			{
				if (!seat.Player)
				{
					continue;
				}
	
				seat.Player.OnCardDeal(this.GetCard());
			}
			
			this.HouseDeal(this.GetCard());

			resolve();
		})
	}

	private HouseDeal(card: Card): void
	{
		this.houseCards.push(card);
		if (this.houseCards.length < 2)
		{
			this.childText.text = this.GetCard().value.toString();
		}
	}

	private HouseReveal(): void
	{
		this.childText.text = this.HeldValue.toString();
	}
}