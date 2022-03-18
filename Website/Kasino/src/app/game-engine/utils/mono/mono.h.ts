import { IComponent } from "../ecs";
import { IStart } from "../lifecycle/start.h";

export interface MonoBehaviour extends IComponent, IStart
{
	
}