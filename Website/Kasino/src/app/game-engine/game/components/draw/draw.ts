import { GameObject } from "src/app/game-engine/gameObject";
import { CanvasLayer, IComponent, Vector2 } from "src/app/game-engine/utils";

export class SpriteRendererComponent implements IComponent
{
	public gameObject: GameObject;

	private _image = new Image();

	public image: string;

	Awake(): void
	{
		this._image.src = this.image;

		this.Draw();
	}

	Update(deltaTime: number): void
	{
		this.Clear();
		this.Draw();
	}
	
	/** Draw a node to the canvas. */
	private Draw(): void
	{
		this._image.onload = () =>
		{
			CanvasLayer.Foreground.DrawImage(this._image, this.gameObject.transform);
		}
	}

	/** Clear a node from the canvas. */
	private Clear(): void
	{
		
	}
}