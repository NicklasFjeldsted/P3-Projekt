import { CanvasLayer } from "../canvas";
import { Color } from "../color";
import { RectTransform } from "../rectTransform";
import { Rendering } from "../rendering";

export class TextComponent extends Rendering
{
	public text: string;
	public renderLayer: number = 3;

	public rectTransform: RectTransform;

	public fontSize: number | undefined;
	public fit: boolean = false;
	public color: Color | undefined;

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

		CanvasLayer.GetLayer(this.renderLayer).DrawText(this.text, this.rectTransform.center, this.fontSize, this.rectTransform.size.x, this.fit, this.color);
	}

	/** Clear Text from the canvas. */
	Clear(): void
	{
		CanvasLayer.GetLayer(this.renderLayer).ClearRect(this.rectTransform.start, this.rectTransform.size);
	}
}