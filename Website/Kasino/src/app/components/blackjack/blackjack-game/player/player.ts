import { MonoBehaviour } from "src/app/game-engine";
import { House } from "../house";
import { Seat } from "../seat";

export class Player extends MonoBehaviour
{
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
}