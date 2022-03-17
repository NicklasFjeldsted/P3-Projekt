import { Entity, IComponent } from "../ecs";
import { Vector2 } from "../vector2D";

export abstract class OnclickComponent implements IComponent
{
	public abstract Entity: Entity | null;
	
	public abstract Awake(): void;
	public abstract Update(deltaTime: number): void;
	public abstract ClickOn(point: Vector2): void;
}