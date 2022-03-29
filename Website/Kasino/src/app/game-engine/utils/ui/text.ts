import { GameObject } from "../../gameObject";
import { CanvasLayer } from "../canvas";
import { IComponent } from "../ecs";
import { Vector2 } from "../vector2";

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

	/** Draw Text to the canvas. */
	private Draw(): void
	{
		if (!this.gameObject.isActive)
		{
			return;
		}
		
		let cachedWidth: TextMetrics = CanvasLayer.UI.DrawText(this.text, this.gameObject.transform);
		this.gameObject.Size = new Vector2(cachedWidth.width, 30);
	}

	/** Clear Text from the canvas. */
	private Clear(): void
	{
		CanvasLayer.UI.ClearRectV3(this.gameObject.transform.position, this.gameObject.Size);
	}
}