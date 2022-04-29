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

	/** Draw the shadow to the canvas. */
	private DrawShadow(): void
	{
		// if (!this.gameObject.isActive || this.image == null)
		// {
		// 	return;
		// }

		// let start: Vector2 = this.center;
		// let size: Vector2 = this.size;

		// let _start: Vector2 = new Vector2(start.x - this.shadowSize, start.y - this.shadowSize);
		// let _size: Vector2 = new Vector2(size.x + this.shadowSize * 2, size.y + this.shadowSize * 2);

		// // Check where it starts
		// //CanvasLayer.GetLayer(6).FillRect(_start, new Vector2(5, 5));

		// CanvasLayer.GetLayer(this.layer ? this.layer : 2).FillRect(_start, _size, this.shadowColor);
	}

	/** Clear the shadow from the canvas. */
	private ClearShadow(): void
	{
		// CanvasLayer.GetLayer(this.layer ? this.layer : 2)
		// .ClearRect(
		// 	new Vector2(this.start.x - this.shadowSize, this.start.y - this.shadowSize),
		// 	new Vector2(this.size.x + this.shadowSize * 2, this.size.y + this.shadowSize * 2)
		// );
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