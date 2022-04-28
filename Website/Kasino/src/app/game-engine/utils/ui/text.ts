import { GameObject } from "../../gameObject";
import { Canvas, CanvasLayer } from "../canvas";
import { IComponent } from "../ecs";
import { RectTransform } from "../rectTransform";
import { Vector2 } from "../vector2";

export class TextComponent implements IComponent
{
	public gameObject: GameObject;

	public text: string;
	public renderLayer: number = 3;

	public rectTransform: RectTransform;

	private offset: number = 5;

	private _width: number = 0;

	public get width(): number
	{
		return this._width;
	}

	public set width(value: number)
	{
		this._width = value;
	}

	constructor(private startText?: string)
	{
		this.text = startText ? startText : " ";
	}

	Start(): void
	{
		//this.gameObject.transform.scale = new Vector2(this.width, 30);
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

		this.width = CanvasLayer.GetLayer(this.renderLayer).DrawText(this.text, this.rectTransform.center).width;
		//this.gameObject.transform.scale = new Vector2(this.width + 10, 30);
	}

	/** Clear Text from the canvas. */
	private Clear(): void
	{
		CanvasLayer.GetLayer(this.renderLayer).ClearRect(this.rectTransform.start, this.rectTransform.size);
	}
}