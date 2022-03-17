import { IComponent, Vector2 } from "src/app/game-engine/utils";
import { Node } from "src/app/game-engine/node";
import { Ship } from "../../ship";

export class ShipLocomotionComponent implements IComponent
{
	public Entity: Ship;

	private _node: Node | null = null;

	public get Node(): Node | null
	{
		return this._node;
	}

	public set Node(v: Node | null)
	{
		this._node = v;
	}

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