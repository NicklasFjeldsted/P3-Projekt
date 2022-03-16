import { IUpdate, IAwake } from "../../utils/lifecycle";
import { Entity } from "./entity";

export interface IComponent extends IAwake, IUpdate
{ 
	Entity: Entity | null;
}