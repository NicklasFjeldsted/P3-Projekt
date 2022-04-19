import { GameObject } from "../../gameObject";
import { CanvasLayer } from "../canvas";
import { IComponent } from "../ecs";
import { Vector2 } from "../vector2";

export class TextComponent implements IComponent
{
	public gameObject: GameObject;

	public text: string;
	public renderLayer: number = 3;

	constructor(private startText?: string)
	{
		this.text = startText ? startText : "Empty Text";
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

		let cachedWidth: TextMetrics = CanvasLayer.GetLayer(this.renderLayer).DrawText(this.text, this.gameObject.transform);
		this.gameObject.Size = new Vector2(cachedWidth.width, 30);
	}

	/** Clear Text from the canvas. */
	private Clear(): void
	{
		CanvasLayer.GetLayer(this.renderLayer).ClearRectV3(this.gameObject.transform.position, this.gameObject.Size);
	}
}