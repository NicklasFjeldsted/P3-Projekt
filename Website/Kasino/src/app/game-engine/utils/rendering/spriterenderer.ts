import { CanvasLayer } from "../canvas";
import { Color } from "../color";
import { RectTransform } from "../rectTransform";
import { Rendering } from "./rendering";

export class SpriteRendererComponent extends Rendering
{
	public image: string | null;
	public layer: number | undefined;
	public shadow: boolean = false;
	public shadowColor: Color = new Color(0, 0, 0, 1);
	public shadowSize: number = 1;
	public errorMargin: number = 1;

	public rectTransform: RectTransform;

	constructor(private imageSource?: string)
	{
		super();
		this.image = imageSource ? imageSource : null;
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

		this.RegisterRenderer();
	}

	Update(deltaTime: number): void
	{

	}

	Dispose(): void
	{
		this.Clear();
		this.gameObject.RemoveComponent(SpriteRendererComponent);
	}

	/** Draw a Sprite to the canvas. */
	Draw(): void
	{
		if (!this.gameObject.isActive || this.image == null)
		{
			return;
		}

		CanvasLayer.GetLayer(this.layer ? this.layer : 1).DrawImage(this.image, this.rectTransform.start, this.rectTransform.size);
	}

	/** Clear a Sprite from the canvas. */
	Clear(): void
	{
		CanvasLayer.GetLayer(this.layer ? this.layer : 1).ClearRect(this.rectTransform.start, this.rectTransform.size);
	}
}