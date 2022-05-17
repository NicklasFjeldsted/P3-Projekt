import { Color, GameObject, MonoBehaviour, Shape, ShapeRendererComponent, TextComponent, Vector2 } from "src/app/game-engine";

export class Tile extends MonoBehaviour
{
	public data: TileData = new TileData();

	public textComponent: TextComponent;

	public betDisplay: GameObject;

	public tileShape: Shape;

	private betColor: Color = new Color(70, 70, 255);

	constructor()
	{
		super();
		this.tileShape = new Shape();
	}

	clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

	public Awake(): void
	{
		this.gameObject.AddComponent(new ShapeRendererComponent(this.tileShape));
		this.textComponent = this.gameObject.GetComponent(TextComponent);
		this.textComponent.color = new Color(255, 255, 255);
		this.textComponent.shadow = true;
		this.textComponent.shadowOffset = new Vector2(1, 2);
		this.textComponent.fontSize = 24;
		this.textComponent.shadowSize = 1;
		this.textComponent.blur = 1;
	}

	public Start(): void
	{
		this.tileShape.radius = 0;
		this.tileShape.outlineWidth = 5;
		this.tileShape.outlineColor = this.betColor;
		switch (this.data.color)
		{
			case TileColors.Black:
				this.tileShape.fillColor = new Color(50, 50, 50);
				break;
				
			case TileColors.Red:
				this.tileShape.fillColor = new Color(255, 50, 50);
				break;
				
			case TileColors.Green:
				this.tileShape.fillColor = new Color(50, 255, 50);
				break;
		}
	}

	public Update(deltaTime: number): void
	{
		
	}

	public AddAmount(amount: number): void
	{
		this.data.betAmount += amount;
		this.data.betAmount = this.clamp(this.data.betAmount, 0, this.gameObject.game.balance.balance);
		this.data.betAmount = this.clamp(this.data.betAmount, 0, 2500);
		
		if (this.data.betAmount > 0)
		{
			this.textComponent.text = this.data.betAmount.toLocaleString('dk', { useGrouping: true });
			this.tileShape.outline = true;
			this.textComponent.shadow = false;
			this.textComponent.color = this.betColor;
		}
		else
		{
			this.textComponent.text = this.data.number.toString();
			this.textComponent.color = new Color(255, 255, 255);
			this.textComponent.shadow = true;
			this.tileShape.outline = false;
		}
	}
	
	public Clear(): void
	{
		this.data.betAmount = 0;
		this.textComponent.text = this.data.number.toString();
		this.textComponent.color = new Color(255, 255, 255);
		this.textComponent.shadow = true;
		this.tileShape.outline = false;
	}
}

export class TileData
{
	public color: TileColors;
	public number: number = -1;
	public betAmount: number = 0;
}

export enum TileColors
{
	Red,
	Black,
	Green
}