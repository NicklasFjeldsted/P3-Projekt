import { GameObject } from '../gameObject';
import { Entity, Vector3 } from '../utils';
import { NetworkingFeature } from './components';

type AbstractFeature<T> = Function & { prototype: T; };
type constr<T> = AbstractFeature<T> | { new(...args: unknown[]): T; };

export class Game extends Entity
{
	private _entities: Entity[] = [];

	public get Entities(): Entity[]
	{
		return this._entities;
	}

	private _lastTimestamp: number = 0;
	private _break: boolean = false;

	/** Instantiates a GameObject in the game. */
	public Instantiate(gameObject: GameObject): void
	{
		gameObject.game = this;
		this._entities.push(gameObject);
	}

	/** Remove a Entity from this game. */
	public RemoveEntity<C extends Entity>(constr: constr<C>): void
	{
		for (let i = 0; i < this._entities.length; i++)
		{
			const entity = this._entities[ i ];

			if (entity instanceof constr)
			{
				this._entities.splice(i, 1);
				return;
			}
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

	public END_GAME(): Promise<boolean>
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
					this.Dispose().then(() =>
					{
						resolve(true);
					}).catch(() =>
					{
						resolve(false);
					});
				})
			}
			else
			{
				this.Dispose().then(() =>
				{
					resolve(true);
				}).catch(() =>
				{
					resolve(false);
				});
			}
		})
	}

	public override Dispose(): Promise<void>
	{
		return new Promise<void>((resolve, reject) =>
		{
			try
			{
				console.groupCollapsed("GAME - Disposal Logs")
				for (let i = 0; i < this.Entities.length; i++)
				{
					this._entities[ i ].Dispose();
					
					if (i === this._entities.length - 1)
					{
						resolve();
					}
				}
				console.groupEnd();
			}
			catch (error)
			{
				console.error(error);
				reject();
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
		if (this._break)
		{
			console.warn("GAME - Loop stopped");
			return;
		}

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