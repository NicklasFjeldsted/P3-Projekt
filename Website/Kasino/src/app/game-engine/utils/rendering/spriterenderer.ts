import { GameObject } from "../../gameObject";
import { CanvasLayer } from "../canvas";
import { IComponent } from "../ecs";

export class SpriteRendererComponent implements IComponent
{
	public gameObject: GameObject;

	public image: string | null;

	constructor(private imageSource?: string)
	{
		this.image = imageSource ?  imageSource : null;
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

	Dispose(): void
	{
		this.gameObject.RemoveComponent(SpriteRendererComponent);
	}

	/** Draw a Sprite to the canvas. */
	private Draw(): void
	{
		if (!this.gameObject.isActive)
		{
			return;
		}
		this.gameObject.Size = CanvasLayer.GetLayer(1).DrawImage(this.image!, this.gameObject.transform);
	}

	/** Clear a Sprite from the canvas. */
	private Clear(): void
	{
		CanvasLayer.GetLayer(1).ClearRectV3(this.gameObject.transform.position, this.gameObject.Size);
	}
}