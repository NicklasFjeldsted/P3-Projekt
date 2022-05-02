import { GameObject, MonoBehaviour, TextComponent } from "src/app/game-engine";
import { GameStage } from "../house";
import { Seat } from "../seat";

export class Bet extends MonoBehaviour
{
	public text: TextComponent;
	public currentBet: number = 0;
	public increaseButton: GameObject;
	public decreaseButton: GameObject;
	public seat: Seat;

	public Start(): void
	{

	}

	public Awake(): void
	{
		this.text = this.gameObject.AddComponent(new TextComponent()).GetComponent(TextComponent);
		this.increaseButton.isActive = this.gameObject.isActive;
		this.decreaseButton.isActive = this.gameObject.isActive;
		this.seat = this.gameObject.parent.GetComponent(Seat);
	}

	public Update(deltaTime: number): void
	{
		this.text.text = `${this.currentBet}kr.`;
		if (this.seat.house.stage == GameStage.Started)
		{
			this.increaseButton.isActive = false;
			this.decreaseButton.isActive = false;
		}
		else
		{
			this.increaseButton.isActive = this.gameObject.isActive;
			this.decreaseButton.isActive = this.gameObject.isActive;
		}
	}

	public AddAmount(amount: number)
	{
		this.currentBet += amount;
	}

	public SubtractAmount(amount: number)
	{
		this.currentBet -= amount;
	}

	public UpdateText(text: number)
	{
		
	}
}