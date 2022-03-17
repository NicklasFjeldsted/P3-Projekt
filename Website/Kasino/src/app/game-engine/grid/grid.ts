import { GameObject, Vector2 } from "../utils";
import { Node } from "../node";
import { Settings } from "../settings";
import { GridOnclickComponent } from "./components";

export class Grid extends GameObject
{
	constructor()
	{
		super();
	}

	/** An array of all the nodes on this Grid. */
	private _nodes: Node[] = [];

	/** Public getter for the nodes associated with this Grid. */
	public get Nodes(): Node[]
	{
		return this._nodes;
	}

	// Awake this grid entity and all of its node children.
	public override Awake(): void
	{
		this.AddComponent(new GridOnclickComponent())

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

	/** Create the grids nodes. */
	private InitNodes(): void
	{
		// Get the grid settings.
		const size = Settings.grid.nodeSize;
		const offset = Settings.grid.nodeOffset;

		// Loop the specified dimension amount both horizontally and vertically.
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