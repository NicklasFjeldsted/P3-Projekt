import { IComponent } from "../ecs";
import { GameObject } from "../gameObject";
import { Vector2 } from "../vector2";

export abstract class OnclickComponent implements IComponent
{
	public abstract gameObject: GameObject | null;
	
	public abstract Start(): void;
	public abstract Awake(): void;
	public abstract Update(deltaTime: number): void;
	public abstract ClickOn(point: Vector2): void;
	public abstract Dispose(): void;
}