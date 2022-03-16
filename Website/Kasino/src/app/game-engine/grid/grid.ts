import { Entity } from "../utils";
import { Node } from "../node";

export class Grid extends Entity
{
	private _nodes: Node[] = [];

	public get Nodes(): Node[]
	{
		return this._nodes;
	}

	// Awake this grid entity and all of its node children.
	public override Awake(): void
	{
		super.Awake();

		for (const node of this._nodes)
		{
			node.Awake();
		}
	}

	// Update this grid entity and all of its children.
	public override Update(deltaTime: number): void
	{
		super.Update(deltaTime);

		for (const node of this._nodes)
		{
			node.Update(deltaTime);
		}
	}
}