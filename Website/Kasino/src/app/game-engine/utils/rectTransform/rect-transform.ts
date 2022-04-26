import { GameObject } from "../../gameObject";
import { IComponent } from "../ecs";
import { Vector2 } from "../vector2";

export class RectTransform implements IComponent
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

	public set start(value: Vector2)
	{
		this._start = value;
	}

	public get end(): Vector2
	{
		if (this._end)
		{
			return this._end;
		}
		throw new Error(`${this.gameObject.gameObjectName}'s ${this.constructor.name} - end is null!`);
	}

	public set end(value: Vector2)
	{
		this._end = value;
	}

	public get size(): Vector2
	{
		return new Vector2(
			this.end.x - this.start.x,
			this.end.y - this.start.y
		);
	}

	public get center(): Vector2
	{
		return new Vector2(
			this.start.x - this.width / 2,
			this.start.y - this.height / 2
		);
	}

	public get width(): number
	{
		return this.size.x + this.gameObject.transform.scale.x;
	}

	public get height(): number
	{
		return this.size.y + this.gameObject.transform.scale.y;
	}

	Awake(): void
	{
		this._start = this.gameObject.transform.position;
		this._end = this.gameObject.transform.position;
	}

	Start(): void
	{
		
	}

	Update(deltaTime: number): void
	{
		this._start = this.gameObject.transform.position;
		this._end = this.gameObject.transform.position;
	}

	Dispose(): void | Promise<void>
	{
		
	}
}