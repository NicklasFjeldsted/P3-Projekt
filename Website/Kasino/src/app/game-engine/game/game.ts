import { GameObject } from '../gameObject';
import { Entity, Vector3 } from '../utils';
import { NetworkingFeature } from './components';

export class Game extends Entity
{
	private static _instance: Game | null;
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

	private _lastTimestamp: number = 0;
	private _break: boolean = false;

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

	/** This is how the game is started up, it will run the functions to begin the game loop and initialization. */
	public BEGIN_GAME(): Promise<void>
	{
		return new Promise((resolve) =>
		{
			this._break = false;
			let networking = this.GetFeature(NetworkingFeature);
			if (networking)
			{
				networking.StartConnection()
				.then(() =>
				{
					this.Awake();
				})
				.finally(() =>
				{
					resolve();
				});
			}
			else
			{
				this.Awake();
				resolve();
			}
		});
	}

	public STOP_GAME(): Promise<boolean>
	{
		this._break = true;
		return new Promise((resolve) =>
		{
			for (let i = 0; i < this.Entities.length; i++)
			{
				this._entities.splice(i, 1);

				if (this._entities.length === 0)
				{
					Game._instance = null;
					if (Game._instance === null)
					{
						return resolve(true);
					}
				}
			}
		});
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

		// Delay Start by one frame to make sure all entities and components have awaken.
		// Then delay the game loop by one frame to make sure all entities and components have executed start.
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
		super.Start();

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

		if (this._break)
		{
			return;
		}
		
		window.requestAnimationFrame(() => this.Update());
	}
}