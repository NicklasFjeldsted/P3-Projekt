import { GameObject, MonoBehaviour, NetworkingFeature, TextComponent } from "src/app/game-engine";
import { GameStage } from "../house";
import { Seat } from "../seat";

export class Bet extends MonoBehaviour
{
	public text: TextComponent;
	public currentBet: number = 0;
	public increaseButton: GameObject;
	public decreaseButton: GameObject;
	public seat: Seat;
	private lockedIn: boolean = false;
	
	clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

	public Start(): void
	{
		this.seat.house.OnStageChange.subscribe((stage) =>
		{
			if (stage == GameStage.Ended)
			{
				this.currentBet = 0;
			}
		});
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
		if (!this.seat.Occupied) return;

		this.text.text = `${this.currentBet}kr.`;

		switch (this.seat.house.CurrentStage)
		{
			case GameStage.Off:
				this.increaseButton.isActive = !this.lockedIn;
				this.decreaseButton.isActive = !this.lockedIn;
				break;
			
			case GameStage.Started:
				this.increaseButton.isActive = false;
				this.decreaseButton.isActive = false;
				this.lockedIn = false;
				break;
			
			case GameStage.Ended:
				this.increaseButton.isActive = !this.lockedIn;
				this.decreaseButton.isActive = !this.lockedIn;
				break;
		}
	}

	public AddAmount(amount: number): void
	{
		this.currentBet += amount;
		this.currentBet = this.clamp(this.currentBet, 0, this.gameObject.game.balance.balance);
	}

	public SubtractAmount(amount: number): void
	{
		this.currentBet -= amount;
		this.currentBet = this.clamp(this.currentBet, 0, this.gameObject.game.balance.balance);
	}

	public LockBet(): void
	{
		if (this.currentBet == 0) return;
		this.lockedIn = true;
		this.gameObject.game.GetFeature(NetworkingFeature).SendData("LockBet", this.currentBet);
	}
}