import { Vector3 } from "../vector3";

export class Transform
{
	constructor(public position: Vector3 = new Vector3(0, 0, 0), public rotation: Vector3 = new Vector3(0, 0, 0), public scale: Vector3 = new Vector3(1, 1, 1)) { }
}