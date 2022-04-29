import { CanvasLayer } from "../canvas";
import { RectTransform } from "../rectTransform";
import { Rendering } from "../rendering";

export class TextComponent extends Rendering
{
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
		super();
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

		this.RegisterRenderer();
	}

	Update(deltaTime: number): void
	{

	}

	/** Draw Text to the canvas. */
	Draw(): void
	{
		if (!this.gameObject.isActive)
		{
			return;
		}

		this.width = CanvasLayer.GetLayer(this.renderLayer).DrawText(this.text, this.rectTransform.center).width;
		//this.gameObject.transform.scale = new Vector2(this.width + 10, 30);
	}

	/** Clear Text from the canvas. */
	Clear(): void
	{
		CanvasLayer.GetLayer(this.renderLayer).ClearRect(this.rectTransform.start, this.rectTransform.size);
	}
}