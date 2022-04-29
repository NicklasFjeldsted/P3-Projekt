import { GameObject } from "../../gameObject";
import { IComponent } from "../ecs";
import { IRendering } from "./rendering.h";

export abstract class Rendering implements IRendering, IComponent
{
	gameObject: GameObject;

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