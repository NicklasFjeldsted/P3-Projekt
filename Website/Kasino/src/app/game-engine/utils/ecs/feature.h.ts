import { IAwake, IUpdate } from "../lifecycle";
import { Entity } from "./entity";

export interface IFeature extends IAwake, IUpdate
{
	Entity: Entity | null;
}