import { GameObject } from "../../gameObject";
import { CanvasLayer } from "../canvas";
import { IComponent } from "../ecs";

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