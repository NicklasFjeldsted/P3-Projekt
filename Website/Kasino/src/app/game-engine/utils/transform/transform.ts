import { Vector3 } from "../vector3";

export class Transform
{
	constructor(public position: Vector3 = new Vector3(0, 0, 0), public rotation: Vector3 = new Vector3(0, 0, 0), public scale: Vector3 = new Vector3(1, 1, 1)) { }
	/** Translate this Transform's position. */
	public Translate(value: Vector3)
	{
		this.position = new Vector3(this.position.x + value.x, this.position.y + value.y, this.position.z + value.z);
	}
}