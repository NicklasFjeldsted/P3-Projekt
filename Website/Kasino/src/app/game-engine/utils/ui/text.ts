import { GameObject } from "../../gameObject";
import { CanvasLayer } from "../canvas";
import { IComponent } from "../ecs";
import { RectTransform } from "../rectTransform";
import { Vector2 } from "../vector2";

export class TextComponent implements IComponent
{
	public gameObject: GameObject;

	public text: string;
	public renderLayer: number = 3;

	public rectTransform: RectTransform;

	constructor(private startText?: string)
	{
		this.text = startText ? startText : "Empty Text";
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
		console.log(`${this.constructor.name} - Disposal`);
		this.gameObject.RemoveComponent(TextComponent);
	}

	/** Draw Text to the canvas. */
	private Draw(): void
	{
		if (!this.gameObject.isActive)
		{
			return;
		}

		let textMetrics: TextMetrics = CanvasLayer.GetLayer(this.renderLayer).DrawText(this.text, this.rectTransform.center);
	}

	/** Clear Text from the canvas. */
	private Clear(): void
	{
		CanvasLayer.GetLayer(this.renderLayer).ClearRect(this.rectTransform.center, this.rectTransform.width, this.rectTransform.height);
	}
}