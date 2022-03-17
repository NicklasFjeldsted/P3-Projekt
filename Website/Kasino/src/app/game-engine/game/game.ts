import { Fleet } from '../fleet';
import { Grid } from '../grid';
import { Entity } from '../utils';
import { GameInputComponent } from './components';
import { SpriteRendererComponent } from './components/draw';

export class Game extends Entity
{
	constructor(grid: Grid, fleetA: Fleet, fleetB: Fleet)
	{
		super();

		this._entities.push(grid, fleetA, fleetB);
		this._entities.push()
	}

	private _entities: Entity[] = [];

	public get GameObjects(): Entity[]
	{
		return this._entities;
	}

	private _lastTimestamp = 0;

	k = new Image();
	
	public async Load(): Promise<void>
	{
		this.k.src = '../../../assets/media/cards.png';
		const toBeLoaded: any[] = [];

		toBeLoaded.push(this.k);

		new Promise(async (resolve, reject) =>
		{
			const finished = [];
			for (let i = 0; i < toBeLoaded.length; i++)
			{
				toBeLoaded[ i ].onload = () =>
				{
					finished.push(toBeLoaded[ i ]);

					if (finished.length >= toBeLoaded.length)
					{
						console.log("Finished loading..");
						resolve(true);
					}
				}
				console.log(`Ran: ${i + 1} times`);
			}
		});
	}

	// Start up the game and get the start time.
	// Then begin the game loop.
	public override Awake(): void
	{
		console.warn("GAME - Awoken");

		super.Awake();

		// Awake all the entities in the game.
		for (const entity of this.GameObjects)
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
		for (const entity of this.GameObjects)
		{
			entity.Update(deltaTime);
		}

		this._lastTimestamp = Date.now();

		window.requestAnimationFrame(() => this.Update());
	}
}