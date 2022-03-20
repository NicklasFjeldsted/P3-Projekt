import { Subject } from "rxjs";
import { MonoBehaviour } from "src/app/game-engine";
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

	private availableCards: number[] = [];
	public seats: Seat[] = [];

	constructor()
	{
		super();
		for (let i = 1; i < 11; i++)
		{
			this.seats.push(new Seat());
		}
	}

	public static OnDeal: Subject<number> = new Subject<number>();

	Start(): void
	{
		this.StartNewRound();
	}

	Awake(): void
	{

	}
	
	Update(deltaTime: number): void
	{
		
	}

	private StartNewRound(): void
	{
		for (let i = 1; i <= 52; i++)
		{
			this.availableCards.push(i);
		}
		this.DealCards();
	}

	private GetCard(): number
	{
		if (this.availableCards.length <= 0)
		{
			throw new Error(`There is no more cards left.`);
		}

		var card: number;
		card = Math.floor(Math.random() * this.availableCards.length);
		for (let i = 0; i < this.availableCards.length; i++)
		{
			if (this.availableCards[i] === card)
			{
				this.availableCards.splice(i, 1)
				break;
			}
		}
		return card;
	}

	public DealCards(): void
	{
		for (const seat of this.seats)
		{
			if (!seat.player)
			{
				continue;
			}

			seat.player.OnCardDeal(this.GetCard());
		}
	}
}