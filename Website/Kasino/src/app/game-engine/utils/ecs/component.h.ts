import { IUpdate, IAwake } from "../../utils/lifecycle";
import { GameObject } from "../../gameObject";

export interface IComponent extends IAwake, IUpdate
{
	/** This is the reference to the Entity that this Component belongs to. */
	gameObject: GameObject | null;
}