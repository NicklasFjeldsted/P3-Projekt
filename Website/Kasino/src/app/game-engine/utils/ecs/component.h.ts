import { IUpdate, IAwake, IStart, IDisposable } from "../../utils/lifecycle";
import { GameObject } from "../../gameObject";

export interface IComponent extends IAwake, IStart, IUpdate, IDisposable
{
	/** This is the reference to the GameObject that this Component belongs to. */
	gameObject: GameObject | null;
}