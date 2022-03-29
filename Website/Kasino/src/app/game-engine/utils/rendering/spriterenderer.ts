import { GameObject } from "../../gameObject";
import { CanvasLayer } from "../canvas";
import { IComponent } from "../ecs";

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
		this.Draw();
	}

	Awake(): void
	{

	}

	Update(deltaTime: number): void
	{
		this.Clear();
		this.Draw();
	}

	/** Draw a Sprite to the canvas. */
	private Draw(): void
	{
		if (!this.gameObject.isActive)
		{
			return;
		}
		this.gameObject.Size = CanvasLayer.Foreground.DrawImage(this.image, this.gameObject.transform);
	}

	/** Clear a Sprite from the canvas. */
	private Clear(): void
	{
		CanvasLayer.Foreground.ClearRectV3(this.gameObject.transform.position, this.gameObject.Size);
	}
}