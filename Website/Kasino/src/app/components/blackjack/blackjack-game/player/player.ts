import { GameObject, MonoBehaviour } from "src/app/game-engine";
import { TextComponent } from "src/app/game-engine/game/components/draw";
import { House } from "../house";

export class Player extends MonoBehaviour
{
	public cards: number[] = [];
	private textComp: TextComponent;

	Start(): void
	{

	}

	Awake(): void
	{
		House.OnDeal.subscribe(e => this.OnCardDeal(e));

		this.textComp = this.gameObject.GetComponent(TextComponent);


	}

	Update(deltaTime: number): void
	{
		
	}

	private OnCardDeal(card: number): void
	{
		this.textComp.text = card.toString();
	}
	
}