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