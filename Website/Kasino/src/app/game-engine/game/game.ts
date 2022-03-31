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
		this.Entities.push(gameObject);
		if (position)
		{
			gameObject.transform.position = position;
		}
	}

	/** Destroys a GameObject from the game. */
	public Destroy(gameObject: GameObject): void
	{
		this._entities.splice(this._entities.findIndex(e => e.entityId = gameObject.entityId), 1);
		return;

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

	public END_GAME(): Promise<void>
	{
		return new Promise((resolve) =>
		{
			this._break = true;
			let networking = this.GetFeature(NetworkingFeature);
			if (networking)
			{
				networking.StopConnection()
				.then(() =>
				{
					this.Dispose();
				})
				.finally(() =>
				{
					resolve();
				});
			}
			else
			{
				this.Dispose();
				resolve();
			}
		})
	}

	public override Dispose(): void
	{
		super.Dispose();

		for (const entity of this.Entities)
		{
			entity.Dispose();
		}
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