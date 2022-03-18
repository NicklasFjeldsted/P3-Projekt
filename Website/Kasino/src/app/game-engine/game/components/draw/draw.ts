import { GameObject } from "src/app/game-engine/gameObject";
import { CanvasLayer, Color, IComponent } from "src/app/game-engine/utils";

export class SpriteRendererComponent implements IComponent
{
	public gameObject: GameObject;

	public image: string;

	constructor(private imageSource?: string)
	{
		imageSource ? this.image = imageSource : null;
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