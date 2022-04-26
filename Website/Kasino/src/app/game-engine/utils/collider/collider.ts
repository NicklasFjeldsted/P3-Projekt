import { GameObject } from "../../gameObject";
import { CanvasLayer } from "../canvas";
import { IComponent } from "../ecs";
import { Vector2 } from "../vector2";

export class ColliderComponent implements IComponent
{
	public gameObject: GameObject;
	
	private _start: Vector2 | null;
	private _end: Vector2 | null;

	public get start(): Vector2
	{
		if (this._start)
		{
			return this._start;
		}
		throw new Error(`${this.gameObject.gameObjectName}'s ${this.constructor.name} - start is null!`);
	}
	public get end(): Vector2
	{
		if (this._end)
		{
			return this._end;
		}
		throw new Error(`${this.gameObject.gameObjectName}'s ${this.constructor.name} - end is null!`);
	}

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
		this._start = new Vector2(0, 0);
		this._end = new Vector2(100, 100);
	}

	Awake(): void
	{
		this._start = this.gameObject.transform.position;
		this.Size = new Vector2(100, 100);
	}

	Start(): void
	{

	}

	Update(deltaTime: number): void
	{
		this._start = this.gameObject.transform.position;
		this.DEBUG_Clear();
		this.DEBUG_Draw();
	}

	Dispose(): void
	{
		this._start = null;
		this._end = null;
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

		CanvasLayer.GetLayer(2).FillOutline(this.start, this.end);
	}

	public DEBUG_Clear(): void
	{
		CanvasLayer.GetLayer(2).ClearRect(this.start, this.Size);
	}
}