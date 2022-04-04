import { GameObject } from "../../gameObject";
import { IComponent } from "../ecs";
import { Vector2 } from "../vector2";

export class Transform implements IComponent
{
	private _position: Vector2 | null;
	private _rotation: Vector2 | null;
	private _scale: number | null;

	public get position(): Vector2
	{
		if (this._position)
		{
			return this._position;
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
	public get scale(): number
	{
		if (this._scale)
		{
			return this._scale;
		}
		throw new Error(`${this.gameObject.gameObjectName}'s transform - scale is null!`);
	}
	public set position(newPosition: Vector2)
	{
		if (this._position)
		{
			this._position = newPosition;
			return;
		}
		throw new Error(`${this.gameObject.gameObjectName}'s transform - position is null!`);
	}
	public set rotation(newRotation: Vector2)
	{
		if (this._rotation)
		{
			this._rotation = newRotation;
			return;
		}
		throw new Error(`${this.gameObject.gameObjectName}'s transform - rotation is null!`);
	}
	public set scale(newScale: number)
	{
		if (this._scale)
		{
			this._scale = newScale;
			return;
		}
		throw new Error(`${this.gameObject.gameObjectName}'s transform - scale is null!`);
	}

	constructor()
	{ 
		this._position = new Vector2(0, 0);
		this._rotation = new Vector2(0, 0);
		this._scale = 1;
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
	
	/** Translate this Transform's position. */
	public Translate(value: Vector2)
	{
		this.position = new Vector2(this.position.x + value.x, this.position.y + value.y);
	}
}