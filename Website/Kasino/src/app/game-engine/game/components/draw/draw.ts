import { GameObject } from "src/app/game-engine/gameObject";
import { CanvasLayer, Color, Entity, IComponent, IFeature, Vector2 } from "src/app/game-engine/utils";
import { Game } from "../../game";

export class SpriteRendererComponent implements IComponent
{
	public gameObject: GameObject;

	public image: string;

	constructor(private imageSource?: string)
	{
		imageSource ? this.image = imageSource : null;
	}
	
	Start(): void
	{
		
	}

	Awake(): void
	{
		this.Draw();
	}

	Update(deltaTime: number): void
	{
		this.Clear();
		this.Draw();
	}
	
	/** Draw a Sprite to the canvas. */
	private Draw(): void
	{
		CanvasLayer.Foreground.DrawImage(this.image, this.gameObject.transform, new Color(0, 0, 0, 1));
	}

	/** Clear a Sprite from the canvas. */
	private Clear(): void
	{
		CanvasLayer.Foreground.ClearCanvas();
	}
}

export class TextComponent implements IComponent
{
	public gameObject: GameObject;

	public text: string = "Empty Text";

	constructor(private startText?: string)
	{
		startText ? this.text = startText : null
	}
	
	Start(): void
	{
		
	}

	Awake(): void
	{
		this.Draw();
	}

	Update(deltaTime: number): void
	{
		this.Clear();
		this.Draw();
	}

	/** Draw Text to the canvas. */
	private Draw(): void
	{
		CanvasLayer.UI.DrawText(this.text, this.gameObject.transform);
	}

	/** Clear Text from the canvas. */
	private Clear(): void
	{
		CanvasLayer.UI.ClearCanvas();
	}
}

export class BackgroundFeature implements IFeature
{
	Entity: Game;

	Awake(): void
	{
		this.Draw();
	}

	Update(deltaTime: number): void
	{

	}
	
	private Draw(): void
	{
		CanvasLayer.Background.FillRect(new Vector2(0, 0), CanvasLayer.Background.Size, new Color(210, 210, 210, 1));
	}

	private Clear(): void
	{
		
	}
}