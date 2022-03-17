import { Fleet } from '../fleet';
import { Grid } from '../grid';
import { Team } from '../team';
import { Entity } from '../utils';
import { GameInputComponent } from './components';

export class Game extends Entity
{
	constructor(grid: Grid, fleetA: Fleet, fleetB: Fleet)
	{
		super();

		this._entities.push(grid, fleetA, fleetB);
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
		this.AddComponent(new GameInputComponent());

		super.Awake();

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