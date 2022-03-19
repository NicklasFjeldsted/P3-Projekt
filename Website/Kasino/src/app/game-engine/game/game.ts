import { GameObject } from '../gameObject';
import { Entity, Vector3 } from '../utils';

export class Game extends Entity
{
	private static _instance: Game;
	public static get Instance(): Game
	{
		if (!Game._instance)
		{
			Game._instance = new Game();
		}

		return Game._instance;
	}

	private _entities: Entity[] = [];

	public get Entities(): Entity[]
	{
		return this._entities;
	}

	private _lastTimestamp = 0;

	k = new Image();
	
	/** **Experimental** method for loading before initializing the game. */
	public async Load(): Promise<void>
	{
		this.k.src = '../../../assets/media/cards.png';
		const toBeLoaded: any[] = [];

		toBeLoaded.push(this.k);

		await new Promise(async (resolve, reject) =>
		{
			const finished = [];
			for (let i = 0; i < toBeLoaded.length; i++)
			{
				toBeLoaded[ i ].onload = () =>
				{
					finished.push(toBeLoaded[ i ]);
					
					if (finished.length === toBeLoaded.length)
					{
						resolve(true);
					}
				}
			}
		});
	}

	/** Instantiates a GameObject in the game. */
	public Instantiate(gameObject: GameObject, position?: Vector3): void
	{
		if (position)
		{
			gameObject.transform.position = position;
		}
		this.Entities.push(gameObject);
	}

	/** Destroys a GameObject from the game. */
	public Destroy(gameObject: GameObject): void
	{
		for (let i = 0; i < this.Entities.length; i++)
		{
			if (this.Entities[i].entityId === gameObject.entityId)
			{
				this.Entities.splice(i, 1);
				return;
			}
		}
		throw new Error(`Could not find ${gameObject.gameObjectName} on this ${this.entityId} entity.`);
	}

	// Start up the game and get the start time.
	// Then begin the game loop.
	public override Awake(): void
	{
		console.warn(`GAME - Awoken`);

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
			this.Start();
			window.requestAnimationFrame(() =>
			{
				this._lastTimestamp = Date.now();
			
				this.Update();
			});
		});
	}

	public override Start(): void
	{
		// Start all the entities in the game.
		for (const entity of this.Entities)
		{
			entity.Start();
		}
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