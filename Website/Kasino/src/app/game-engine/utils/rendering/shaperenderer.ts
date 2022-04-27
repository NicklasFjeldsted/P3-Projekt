import { GameObject } from "../../gameObject";
import { Canvas, CanvasLayer } from "../canvas";
import { Color } from "../color";
import { IComponent } from "../ecs";
import { RectTransform } from "../rectTransform";
import { Vector2 } from "../vector2";

export class ShapeRendererComponent implements IComponent
{
	public gameObject: GameObject;

	public layer: number | undefined;

	public rectTransform: RectTransform;

	constructor(private imageSource?: string)
	{
		//this.image = imageSource ? imageSource : null;
	}

	Start(): void
	{

	}

	Awake(): void
	{
		if (this.gameObject.HasComponent(RectTransform))
		{
			this.rectTransform = this.gameObject.GetComponent(RectTransform);
		}
		else
		{
			this.gameObject.AddComponent(new RectTransform(), 1).GetComponent(RectTransform).Awake();
		}
	}

	Update(deltaTime: number): void
	{
		this.Clear();
		this.Draw();
	}

	Dispose(): void
	{
		this.Clear();
		this.gameObject.RemoveComponent(ShapeRendererComponent);
	}

	/** Draw a Shape to the canvas. */
	private Draw(): void
	{
		if (!this.gameObject.isActive)
		{
			return;
		}

		CanvasLayer.GetLayer(this.layer ? this.layer : 1).RoundedRect(this.rectTransform.start, new Vector2(80, 30), 3);
	}

	/** Clear a Shape from the canvas. */
	private Clear(): void
	{
		CanvasLayer.GetLayer(this.layer ? this.layer : 1).ClearRect(this.rectTransform.start, this.rectTransform.size);
	}
}