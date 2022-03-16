import { Entity, Vector2 } from "../utils";
import { Node } from "../node";
import { Settings } from "../settings";

export class Grid extends Entity
{
	constructor(private gridSize:number, private nodeSize: number)
	{
		super();
	}

	private _nodes: Node[] = [];

	public get Nodes(): Node[]
	{
		return this._nodes;
	}

	// Awake this grid entity and all of its node children.
	public override Awake(): void
	{
		super.Awake();

		this.InitNodes();

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

	private InitNodes(): void
	{
		// const size = this.nodeSize;
		// const offset = this.gridSize;
		const size = Settings.grid.nodeSize;
		const offset = Settings.grid.nodeOffset;

		for (let y = 0; y < Settings.grid.dimension; y++)
		{
			for (let x = 0; x < Settings.grid.dimension; x++)
			{
				const start = new Vector2(
					x * (size + offset) + offset,
					y * (size + offset) + offset
				);

				const end = new Vector2(
					start.x + size,
					start.y + size
				);

				const index = new Vector2(x, y);
				
				const node = new Node(start, end, index);
				this._nodes.push(node);
			}
		}
	}
}