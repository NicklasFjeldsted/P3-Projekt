import { GameObject } from "../gameObject";
import { IComponent } from "../ecs";
import { Vector2 } from "../vector2";

export class RectTransform implements IComponent
{
	public gameObject: GameObject;

	public get start(): Vector2
	{
		return new Vector2(
			this.center.x - this.size.x / 2,
			this.center.y - this.size.y / 2
		);
	}

	public get end(): Vector2
	{
		return new Vector2(
			this.start.x + this.size.x,
			this.start.y + this.size.y
		);
	}

	public get size(): Vector2
	{
		return this.gameObject.transform.scale;
	}

	public get center(): Vector2
	{
		return this.gameObject.transform.position;
	}

	Awake(): void
	{

	}

	Start(): void
	{
		
	}

	Update(deltaTime: number): void
	{

	}

	Dispose(): void | Promise<void>
	{
		
	}
}