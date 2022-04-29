import { CanvasLayer } from "../canvas";
import { RectTransform } from "../rectTransform";
import { Shape } from "../sprite";
import { Rendering } from "./rendering";

export class ShapeRendererComponent extends Rendering
{
	public layer: number | undefined;

	public shape: Shape | undefined;

	constructor(private _shape?: Shape)
	{
		super();
		if (_shape)
		{
			this.shape = _shape;
		}
	}

	public rectTransform: RectTransform;

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

	Start(): void
	{

	}


	Update(deltaTime: number): void
	{

	}

	Draw(): void
	{
		if (!this.gameObject.isActive || !this.shape)
		{
			return;
		}

		CanvasLayer.GetLayer(this.layer ? this.layer : 1).ExtendedRect(this.rectTransform.start, this.rectTransform.size, this.shape);
	}

	Clear(): void
	{
		CanvasLayer.GetLayer(this.layer ? this.layer : 1).ClearRect(this.rectTransform.start, this.rectTransform.size);
	}
}