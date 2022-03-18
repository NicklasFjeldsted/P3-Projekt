import { GameObject } from "../../gameObject";
import { IComponent } from "../ecs";
import { IStart } from "../lifecycle/start.h";
import { Transform } from "../transform";

export abstract class MonoBehaviour implements IComponent, IStart
{
	gameObject: GameObject;

	public get transform(): Transform
	{
		return this.gameObject.transform;
	}

	abstract Start(): void;

	abstract Awake(): void;

	abstract Update(deltaTime: number): void;

}