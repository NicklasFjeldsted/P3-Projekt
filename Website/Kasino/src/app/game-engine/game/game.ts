import { Fleet } from '../fleet';
import { Grid } from '../grid';
import { Team } from '../team';
import { Entity } from '../utils';

export class Game extends Entity
{
	constructor()
	{
		super();
	}

	private _entities: Entity[] = [];

	public get Entities(): Entity[]
	{
		return this._entities;
	}

	private _lastTimestamp = 0;

	// Start up the game and get the start time.
	// Then begin the game loop.
	public override Awake(): void
	{
		super.Awake();

		const grid = new Grid();

		// Adding entities to the game.
		this._entities.push(grid, new Fleet(Team.A, grid), new Fleet(Team.B, grid));

		// Awake all the entities in the game.
		for (const entity of this.Entities)
		{
			entity.Awake();
		}

		// Delay the game loop by one frame to make sure all entities and
		// components have awaken.
		window.requestAnimationFrame(() =>
		{
			this._lastTimestamp = Date.now();
			
			this.Update();
		});
	}

	// Update the game everyframe and calculate the new deltaTime.
	public override Update(): void
	{
		// deltaTime will look something like 0.283192 milliseconds
		const deltaTime = (Date.now() - this._lastTimestamp) / 1000;

		super.Update(deltaTime);

		// Update all the entities in this game.
		for (const entity of this.Entities)
		{
			entity.Update(deltaTime);
		}

		this._lastTimestamp = Date.now();

		window.requestAnimationFrame(() => this.Update());
	}
}