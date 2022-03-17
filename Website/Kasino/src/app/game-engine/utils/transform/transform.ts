import { Vector3 } from "../vector3";

export class Transform
{
	constructor(public position: Vector3, public rotation: Vector3, public scale: Vector3) { }
}