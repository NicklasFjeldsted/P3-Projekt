import { Fleet } from "../fleet";
import { Entity, Vector2 } from "../utils";
import { Node } from "../node";
import { ShipDrawComponent, ShipLocomotionComponent } from "./components";

export class Ship extends Entity
{
	private readonly _locomotionComponent: ShipLocomotionComponent;

	constructor(public readonly Factory: Fleet, node: Node)
	{
		super();

		this._locomotionComponent = new ShipLocomotionComponent();
		this._locomotionComponent.Node = node;
	}

	/** Public getter for the position of the ship. */
	public get Position(): Vector2 | null
	{
		return this._locomotionComponent.Position;
	}
	
	public override Awake(): void
	{
		this.AddComponent(this._locomotionComponent);
		this.AddComponent(new ShipDrawComponent());

		super.Awake();
	}
}