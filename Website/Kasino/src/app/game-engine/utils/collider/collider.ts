import { GameObject } from "../../gameObject";
import { CanvasLayer } from "../canvas";
import { IComponent } from "../ecs";
import { Vector2 } from "../vector2";

export class ColliderComponent implements IComponent
{
	public gameObject: GameObject;
	
	private start: Vector2;
	private end: Vector2;

	public get Size(): Vector2
	{
		return new Vector2(
			this.end.x - this.start.x,
			this.end.y - this.start.y
		);
	}

	public set Size(value: Vector2)
	{
		this.end.x = this.start.x + value.x;
		this.end.y = this.start.y + value.y;
	}

	constructor()
	{
		this.start = new Vector2(0, 0);
		this.end = new Vector2(100, 100);
		//this.Size = startSize ? startSize : new Vector2(100, 100);
	}

	Awake(): void
	{
		this.start = this.gameObject.transform.position;
		this.Size = new Vector2(100, 100);
	}

	Start(): void
	{

	}

	Update(deltaTime: number): void
	{
		this.start = this.gameObject.transform.position;
		this.DEBUG_Clear();
		this.DEBUG_Draw();
	}

	Dispose(): void
	{
		this.start.Dispose();
		this.end.Dispose();
		this.gameObject.RemoveComponent(ColliderComponent);
	}

	public Hit(point: Vector2): boolean
	{
		if (!this.gameObject.isActive)
		{
			return false;
		}

		if (point.x < this.start.x)
		{
			return false;
		}

		if (point.x > this.end.x)
		{
			return false;
		}

		if (point.y < this.start.y)
		{
			return false;
		}

		if (point.y > this.end.y)
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
		
		CanvasLayer.Debug.FillOutline(this.start, this.end);
	}

	public DEBUG_Clear(): void
	{
		CanvasLayer.Debug.ClearRect(this.start, this.Size);
	}
}