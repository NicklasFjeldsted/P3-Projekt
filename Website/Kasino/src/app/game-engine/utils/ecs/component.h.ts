import { IUpdate, IAwake, IStart } from "../../utils/lifecycle";
import { GameObject } from "../../gameObject";

export interface IComponent extends IAwake, IUpdate, IStart
{
	/** This is the reference to the GameObject that this Component belongs to. */
	gameObject: GameObject | null;
}