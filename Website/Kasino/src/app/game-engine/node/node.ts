import { Entity, Vector2 } from "../utils";
import { NodeDrawComponent } from "./components";

export class Node extends Entity
{
	// constructor(
	// 	public readonly Start: Vector2,
	// 	public readonly End: Vector2,
	// 	public readonly Index: Vector2
	// )
	// {
	// 	super();
	// }

	// /** **TEMPORARY** */
	// public IsActive = false;

	// // Calculate the size of this Node entity.
	// /** Public getter for the Size of this Node. */
	// public get Size(): Vector2
	// {
	// 	return new Vector2(
	// 		this.End.x - this.Start.x,
	// 		this.End.y - this.Start.y
	// 	)
	// };

	// // Calculate the center position of this Node entity.
	// /** Public getter for the center position of this Node. */
	// public get Center(): Vector2
	// {
	// 	return new Vector2(this.Start.x + this.Size.x / 2, this.Start.y + this.Size.y / 2);
	// }

	// public override Awake(): void
	// {
	// 	//this.AddComponent(new NodeDrawComponent());

	// 	super.Awake();
	// }

	// /** Return true if the point argument is within this Node. */
	// public Occupies(point: Vector2): boolean
	// {
	// 	if (point.x < this.Start.x)
	// 	{
	// 		return false;
	// 	}

	// 	if (point.x > this.End.x)
	// 	{
	// 		return false;
	// 	}

	// 	if (point.y < this.Start.y)
	// 	{
	// 		return false;
	// 	}

	// 	if (point.y > this.End.y)
	// 	{
	// 		return false;
	// 	}

	// 	return true;
	// }
}