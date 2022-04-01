import { GameObject } from "../../gameObject";
import { IComponent } from "../ecs";
import { Vector3 } from "../vector3";

export class Transform implements IComponent
{
	private _position: Vector3 | null;
	private _rotation: Vector3 | null;
	private _scale: Vector3 | null;

	public get position(): Vector3
	{
		if (this._position)
		{
			return this._position;
		}
		throw new Error(`${this.gameObject.gameObjectName}'s transform - position is null!`);
	}
	public get rotation(): Vector3
	{
		if (this._rotation)
		{
			return this._rotation;
		}
		throw new Error(`${this.gameObject.gameObjectName}'s transform - rotation is null!`);
	}
	public get scale(): Vector3
	{
		if (this._scale)
		{
			return this._scale;
		}
		throw new Error(`${this.gameObject.gameObjectName}'s transform - scale is null!`);
	}
	public set position(newPosition: Vector3)
	{
		if (this._position)
		{
			this._position = newPosition;
			return;
		}
		throw new Error(`${this.gameObject.gameObjectName}'s transform - position is null!`);
	}
	public set rotation(newRotation: Vector3)
	{
		if (this._rotation)
		{
			this._rotation = newRotation;
			return;
		}
		throw new Error(`${this.gameObject.gameObjectName}'s transform - rotation is null!`);
	}
	public set scale(newScale: Vector3)
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
		this._position = new Vector3(0, 0, 0);
		this._rotation = new Vector3(0, 0, 0);
		this._scale = new Vector3(1, 1, 1);
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
	public Translate(value: Vector3)
	{
		this.position = new Vector3(this.position.x + value.x, this.position.y + value.y, this.position.z + value.z);
	}
}