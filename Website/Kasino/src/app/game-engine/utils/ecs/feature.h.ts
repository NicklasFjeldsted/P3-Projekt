import { IAwake, IDisposable, IStart, IUpdate } from "../lifecycle";
import { Entity } from "./entity";

export interface IFeature extends IAwake, IUpdate, IStart
{
	Entity: Entity | null;
}