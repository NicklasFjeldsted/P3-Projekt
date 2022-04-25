import { GameObject } from "../../gameObject";
import { CanvasLayer } from "../canvas";
import { IComponent } from "../ecs";
import { Vector2 } from "../vector2";

export class SpriteRendererComponent implements IComponent
{
	public gameObject: GameObject;

	public image: string | null;
	public layer: number | undefined;

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
		this.Clear();
		this.gameObject.RemoveComponent(SpriteRendererComponent);
	}

	/** Draw a Sprite to the canvas. */
	private Draw(): void
	{
		if (!this.gameObject.isActive)
		{
			return;
		}

		if (this.image == null)
		{
			this.Clear();
			return;
		}
		this.gameObject.Size = CanvasLayer.GetLayer(this.layer ? this.layer : 1).DrawImage(this.image!, this.gameObject.transform);
	}

	/** Clear a Sprite from the canvas. */
	private Clear(): void
	{
		CanvasLayer.GetLayer(this.layer ? this.layer : 1).ClearRectV3(this.gameObject.transform.position, new Vector2(this.gameObject.Size.x + 1, this.gameObject.Size.y + 1));
	}
}