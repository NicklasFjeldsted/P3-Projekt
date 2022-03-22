import { Game, GameObject, MonoBehaviour } from "src/app/game-engine";
import { Card } from "../cards";
import { House } from "../house";
import { Seat } from "../seat";

export class Player extends MonoBehaviour
{
	public cards: number[] = [];
	public seat: Seat | null;

	Awake(): void
	{

	}

	Start(): void
	{

	}

	Update(deltaTime: number): void
	{

	}

	public Connect(): void
	{
		for (const seat of House.Instance.seats)
		{
			if (seat.Occupied)
			{
				seat.gameObject.isActive = false;
			}
		}
	}

	public SitDown(): void
	{
		if (this.seat)
		{
			for (const seat of House.Instance.seats)
			{
				if (!seat.Occupied)
				{
					seat.gameObject.isActive = false;
				}
			}
		}
	}

	public OnCardDeal(card: Card): void
	{
		this.seat!.UpdateCards(card);
	}
}