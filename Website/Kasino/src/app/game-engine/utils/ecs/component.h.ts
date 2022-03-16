import { IUpdate, IAwake } from "../../utils/lifecycle";
import { Entity } from "./entity";

export interface IComponent extends IUpdate, IAwake
{ 
	Entity: Entity | null;
}