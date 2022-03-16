import { Entity, Vector2 } from "../utils";
import { NodeDrawComponent } from "./components";

export class Node extends Entity
{
	constructor(
		public readonly Start: Vector2,
		public readonly End: Vector2,
		public readonly Index: Vector2
	)
	{
		super();
	}

	public get Size(): Vector2
	{
		return new Vector2(
			this.End.x - this.Start.x,
			this.End.y - this.Start.y
		)
	};

	public override Awake(): void
	{
		this.AddComponent(new NodeDrawComponent());

		super.Awake();
	}
}