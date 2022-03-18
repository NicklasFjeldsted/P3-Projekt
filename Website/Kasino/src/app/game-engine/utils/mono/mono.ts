import { GameObject } from "../../gameObject";
import { IComponent } from "../ecs";
import { Transform } from "../transform";

export abstract class MonoBehaviour implements IComponent
{
	gameObject: GameObject;

	public get transform(): Transform
	{
		return this.gameObject.transform;
	}

	public abstract Start(): void;

	public abstract Awake(): void;

	public abstract Update(deltaTime: number): void;

}