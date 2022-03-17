import { IUpdate, IAwake } from "../../utils/lifecycle";
import { Entity } from "./entity";

export interface IComponent extends IAwake, IUpdate
{
	/** This is the reference to the Entity that this Component belongs to. */
	Entity: Entity | null;
}