import { GameObject, MonoBehaviour } from "src/app/game-engine";
import { TextComponent } from "src/app/game-engine/game/components/draw";
import { House } from "../house";

export class Player extends MonoBehaviour
{
	public cards: number[] = [];
	private textComp: TextComponent;

	Awake(): void
	{
		House.OnDeal.subscribe(e => this.OnCardDeal(e));

		this.textComp = this.gameObject.GetComponent(TextComponent);
	}

	Start(): void
	{
		
	}

	Update(deltaTime: number): void
	{
		
	}

	private OnCardDeal(card: number): void
	{
		this.cards.push(card);
		this.UpdateDisplayedCards();
	}

	private UpdateDisplayedCards(): void
	{
		this.textComp.text = "";
		for (let card of this.cards)
		{
			this.textComp.text += card + "  ";
		}
	}
	
}