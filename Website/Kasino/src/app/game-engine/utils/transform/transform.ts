import { GameObject } from "../../gameObject";
import { IComponent } from "../ecs";
import { Vector3 } from "../vector3";

export class Transform implements IComponent
{
	constructor(public position: Vector3 = new Vector3(0, 0, 0), public rotation: Vector3 = new Vector3(0, 0, 0), public scale: Vector3 = new Vector3(1, 1, 1)) { }
	gameObject: GameObject;

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
		this.position.Dispose();
		this.rotation.Dispose();
		this.scale.Dispose();
		this.gameObject.RemoveComponent(Transform);
	}
	
	/** Translate this Transform's position. */
	public Translate(value: Vector3)
	{
		this.position = new Vector3(this.position.x + value.x, this.position.y + value.y, this.position.z + value.z);
	}
}