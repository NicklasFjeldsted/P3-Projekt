import { GameObject } from "../gameObject";
import { IComponent } from "../ecs";
import { Transform } from "../transform";

export abstract class MonoBehaviour implements IComponent
{
	public gameObject: GameObject;

	public get transform(): Transform
	{
		return this.gameObject.transform;
	}

	public abstract Start(): void;

	public abstract Awake(): void;

	public abstract Update(deltaTime: number): void;

	public Dispose(): void
	{
		console.groupCollapsed(`${this.constructor.name} - References`);
		for (const [key, value] of Object.entries(this))
		{
			console.groupCollapsed(`%c${key}`, 'color: #ff8400;');
			console.log(value);
			console.groupEnd();
		}
		console.groupEnd();

		for (const property in this)
		{
			delete this[property];
		}

		this.gameObject.RemoveComponent(MonoBehaviour);
	}
}