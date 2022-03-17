import { IComponent, Vector2 } from "src/app/game-engine/utils";
import { Node } from "src/app/game-engine/node";
import { Ship } from "../../ship";

export class ShipLocomotionComponent implements IComponent
{
	public gameObject: Ship;

	// Since the ship is only supposed to move to and from nodes
	// there is a reference to the current Node the ship is "assigned" to.
	private _node: Node | null = null;

	/** Public getter for the _node reference. */
	public get Node(): Node | null
	{
		return this._node;
	}

	/** Public setter for the _node reference. */
	public set Node(v: Node | null)
	{
		this._node = v;
	}

	/** Public getter for the position of the Node, if the Node is null it will return null. */
	public get Position(): Vector2 | null
	{
		return this.Node ? this.Node.Center : null;
	}

	Awake(): void
	{

	}

	Update(deltaTime: number): void
	{

	}
	
}