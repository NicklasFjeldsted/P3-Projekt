import { Button, Color, Mathf, MonoBehaviour, NetworkingFeature, Shape, ShapeRendererComponent, TextComponent, Vector2 } from "src/app/game-engine";
import { House } from "../house";
import { BetData, BetType, TileColors, TileData } from "../tile";

export class Betable extends MonoBehaviour
{
	public betAmount: number = 0;
	public buttonScript: Button;
	private shapeRenderer: ShapeRendererComponent;
	private shape: Shape;
	public textComponent: TextComponent;
	private originalText: string;
	private betColor: Color = new Color(70, 70, 255);
	private startColor: Color = new Color(0, 0, 0);
	
	constructor(private house: House, private betType: BetType)
	{
		super();
	}

	public Start(): void
	{
		this.shape.radius = 0;
		this.shape.outlineWidth = 2;
		this.shape.outlineColor = this.startColor;
		this.shape.shadow = false;
		this.shape.outline = true;
		this.buttonScript.OnMouseDown.subscribe(() =>
		{
			if (this.gameObject.game.balance.balance <= this.house.betChild.totalBetted) return;
			
			let remaining = Mathf.Clamp(this.house.betChild.BetIncrement, 0, this.gameObject.game.balance.balance - this.house.betChild.totalBetted);
			
			if (this.house.BetLocked)
			{
				return;
			}

			this.AddAmount(remaining, this.betType)

			this.house.betChild.totalBetted += remaining;
		});
	}

	public Awake(): void
	{
		this.buttonScript = this.gameObject.GetComponent(Button);
		this.shape = new Shape();
		this.buttonScript.ButtonShape = this.shape;
		this.textComponent = this.gameObject.GetComponent(TextComponent);
		this.originalText = this.buttonScript.text;

		this.textComponent.color = this.startColor;
		this.textComponent.blur = 1;
	}

	public Update(deltaTime: number): void
	{
		
	}

	public AddAmount(amount: number, type: BetType, data: TileData = new TileData()): void
	{
		this.betAmount += amount;
		this.betAmount = Mathf.Clamp(this.betAmount, 0, this.gameObject.game.balance.balance);
		this.betAmount = Mathf.Clamp(this.betAmount, 0, 2500);

		data.betAmount += this.betAmount;

		if (type == BetType.Black)
		{
			data.color = TileColors.Black;
		}

		if (type == BetType.Red)
		{
			data.color = TileColors.Red;
		}
		
		if (this.betAmount > 0)
		{
			this.buttonScript.text = this.betAmount.toLocaleString('dk', { useGrouping: true });
			this.textComponent.color = this.betColor;
			this.shape.outlineColor = this.betColor;
			this.gameObject.game.GetFeature(NetworkingFeature).SendData("Update_Bet_Data", JSON.stringify(new BetData(data, type)));
		}
		else
		{
			this.buttonScript.text = this.originalText;
			this.textComponent.color = this.startColor;
			this.textComponent.color = this.betColor;
			this.textComponent.shadow = true;
			this.gameObject.game.GetFeature(NetworkingFeature).SendData("Remove_Bet_Data", JSON.stringify(new BetData(data, type)));
		}
	}

	public Clear(): void
	{
		this.betAmount = 0;
		this.buttonScript.text = this.originalText;
		this.textComponent.color = this.startColor;
		this.shape.outlineColor = this.startColor;
		this.textComponent.shadow = true;
	}
}