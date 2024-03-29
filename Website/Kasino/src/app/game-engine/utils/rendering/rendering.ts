import { GameObject } from "../gameObject";
import { IComponent } from "../ecs";
import { IRendering } from "./rendering.h";

export abstract class Rendering implements IRendering, IComponent
{
	get Changed(): boolean
	{
		return this.old === this.constructor;
	}

	gameObject: GameObject;

	old: Function;

	abstract Awake(): void;
	abstract Start(): void;
	abstract Update(deltaTime: number): void;
	abstract Draw(): void;
	abstract Clear(): void;

	protected RegisterRenderer(): void
	{
		this.gameObject.game.RegisterRenderer(this);
	}
}