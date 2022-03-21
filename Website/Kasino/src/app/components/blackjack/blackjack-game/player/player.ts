import { MonoBehaviour } from "src/app/game-engine";
import { Card } from "../cards";
import { Seat } from "../seat";

export class Player extends MonoBehaviour
{
	public cards: number[] = [];
	public seat: Seat;

	Awake(): void
	{

	}

	Start(): void
	{
	}

	Update(deltaTime: number): void
	{
		
	}

	public OnCardDeal(card: Card): void
	{
		this.seat.UpdateCards(card);
	}
}