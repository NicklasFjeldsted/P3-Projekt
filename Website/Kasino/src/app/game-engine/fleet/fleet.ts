import { Entity } from "../utils";
import { Team } from "../team";
import { Ship } from "../ship";
import { Settings } from "../settings";
import { Grid } from "../grid";

export class Fleet extends Entity
{
	constructor(public readonly Team: Team, private readonly _grid: Grid)
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
		const dimension = Settings.grid.dimension;
		const nodes = this._grid.Nodes;
		
		for (let i = 0; i < fleetSize; i++)
		{
			// If this fleet entitys team is Team A it will select the nodes from the left side, if not it will select them from the right.
			const node = this.Team == Team.A ? nodes[ i * dimension ] : nodes[ nodes.length - 1 - i * dimension ];

			const ship = new Ship(this, node);
			this._ships.push(ship);
			ship.Awake();
		}
	}
}