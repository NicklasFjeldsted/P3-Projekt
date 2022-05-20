import { GameObject } from "../gameObject";
import { IComponent } from "../ecs";
import { Vector2 } from "../vector2";

export class Transform implements IComponent
{
	private _position: Vector2 | null;
	private _rotation: Vector2 | null;
	private _scale: Vector2 | null;

	public get position(): Vector2
	{
		if (this._position)
		{
			return this._position;
		}
		throw new Error(`${this.gameObject.gameObjectName}'s transform - position is null!`);
	}
	public set position(value: Vector2)
	{
		if (this._position)
		{
			this._position = value;
			return;
		}
		throw new Error(`${this.gameObject.gameObjectName}'s transform - position is null!`);
	}
	public get rotation(): Vector2
	{
		if (this._rotation)
		{
			return this._rotation;
		}
		throw new Error(`${this.gameObject.gameObjectName}'s transform - rotation is null!`);
	}
	public set rotation(value: Vector2)
	{
		if (this._rotation)
		{
			this._rotation = value;
			return;
		}
		throw new Error(`${this.gameObject.gameObjectName}'s transform - rotation is null!`);
	}
	public get scale(): Vector2
	{
		if (this._scale)
		{
			return this._scale;
		}
		throw new Error(`${this.gameObject.gameObjectName}'s transform - scale is null!`);
	}
	public set scale(value: Vector2)
	{
		if (this._scale)
		{
			this._scale = value;
			return;
		}
		throw new Error(`${this.gameObject.gameObjectName}'s transform - scale is null!`);
	}

	constructor()
	{ 
		this._position = new Vector2(0, 0);
		this._rotation = new Vector2(0, 0);
		this._scale = new Vector2(0, 0);
	}

	public gameObject: GameObject;

	Awake(): void
	{
		
	}

	Start(): void
	{
		
	}

	Update(deltaTime: number): void
	{

	}

	Dispose(): void
	{
		this._position = null;
		this._rotation = null
		this._scale = null;
		this.gameObject.RemoveComponent(Transform);
	}

	public Equals(value1: Vector2, value2: Vector2): boolean
	{
		if (value1.x == value2.x || value1.y == value2.y)
		{
			return true;
		}
		else if (value2.x == value1.x || value2.y == value1.y)
		{
			return true;
		}

		return false;
	}
	
	/** Translate this Transform's position. */
	public Translate(value: Vector2)
	{
		this.position = new Vector2(this.position.x + value.x, this.position.y + value.y);
		for (let child of this.gameObject.Children)
		{
			child.transform.Translate(new Vector2(value.x, value.y));
		}
	}
}