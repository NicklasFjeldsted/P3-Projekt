import { GameInputFeature, MonoBehaviour, Vector2 } from "src/app/game-engine";
import { ColliderComponent, TextComponent } from "src/app/game-engine/utils";
import { House } from "../house";

export class Player extends MonoBehaviour
{
	public cards: number[] = [];
	private textComp: TextComponent;
	private collider: ColliderComponent;

	Awake(): void
	{
		GameInputFeature.OnClick.subscribe(e => this.OnClick(e));
		
		this.textComp = this.gameObject.GetComponent(TextComponent);
		this.collider = this.gameObject.GetComponent(ColliderComponent);
	}

	Start(): void
	{
	}

	Update(deltaTime: number): void
	{
		
	}

	private OnClick(point: Vector2): void
	{
		if (!this.collider.Hit(point))
		{
			return;
		}

		console.log(`Hit ${this.gameObject.gameObjectName}`);
	}

	public OnCardDeal(card: number): void
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