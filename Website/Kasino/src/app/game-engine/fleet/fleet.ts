import { Entity } from "../utils";
import { Team } from "../team";
import { Ship } from "../ship";
import { Settings } from "../settings";

export class Fleet extends Entity
{
	constructor(public readonly Team: Team)
	{
		super();
	}

	private _ships: Ship[] = [];

	public override Awake(): void
	{
		super.Awake();

		this.PrepareShips();
	}

	public override Update(deltaTime: number): void
	{
		super.Update(deltaTime);

		this._ships.map(ship => ship.Update(deltaTime));
	}

	private PrepareShips(): void
	{
		const fleetSize = Settings.ships.fleetSize;
		
		for (let i = 0; i < fleetSize; i++)
		{
			const ship = new Ship(this);
			this._ships.push(ship);
			ship.Awake();
		}
	}
}