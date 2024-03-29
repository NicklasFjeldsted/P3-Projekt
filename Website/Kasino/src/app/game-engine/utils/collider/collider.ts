import { GameObject } from "../gameObject";
import { CanvasLayer } from "../canvas";
import { IComponent } from "../ecs";
import { RectTransform } from "../rectTransform";
import { Vector2 } from "../vector2";

export class ColliderComponent implements IComponent
{
	public gameObject: GameObject;
	
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
	}

	Start(): void
	{

	}

	Update(deltaTime: number): void
	{

	}

	public Hit(point: Vector2): boolean
	{
		if (!this.gameObject.isActive)
		{
			return false;
		}
		
		if (point.x < this.rectTransform.start.x)
		{
			return false;
		}
		
		if (point.x > this.rectTransform.end.x)
		{
			return false;
		}
		
		if (point.y < this.rectTransform.start.y)
		{
			return false;
		}
		
		if (point.y > this.rectTransform.end.y)
		{
			return false;
		}

		return true;
	}

	public DEBUG_Draw(): void
	{
		if (!this.gameObject.isActive)
		{
			return;
		}

		CanvasLayer.GetLayer(2).StrokeRect(this.rectTransform.start, this.rectTransform.size);
	}

	public DEBUG_Clear(): void
	{
		CanvasLayer.GetLayer(2).ClearRect(this.rectTransform.start, this.rectTransform.size);
	}
}