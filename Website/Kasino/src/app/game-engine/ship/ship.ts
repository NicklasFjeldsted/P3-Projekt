import { Fleet } from "../fleet";
import { Entity } from "../utils";
import { ShipDrawComponent } from "./components";

export class Ship extends Entity
{
	constructor(public readonly Factory: Fleet)
	{
		super();
	}
	
	public override Awake(): void
	{
		this.AddComponent(new ShipDrawComponent());

		super.Awake();
	}
}