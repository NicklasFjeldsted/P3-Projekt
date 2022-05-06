import { GameObject } from '../utils/gameObject';
import { CanvasLayer, Entity, IRendering, Vector2 } from '../utils';
import { NetworkingFeature } from './components';
import { Balance } from 'src/app/interfaces/balance';
import { User, UserData } from 'src/app/interfaces/User';

type AbstractFeature<T> = Function & { prototype: T; };
type constr<T> = AbstractFeature<T> | { new(...args: unknown[]): T; };

export class Game extends Entity
{
	private _entities: Entity[] = [];

	public get Entities(): Entity[]
	{
		return this._entities;
	}

	private _renders: IRendering[] = [];

	public get Renders(): IRendering[]
	{
		return this._renders;
	}

	private _lastTimestamp: number = 0;

	private _user: UserData
	public get user(): UserData
	{
		if (this._user)
		{
			return this._user;
		}
		throw new Error(`User did not load correctly!`);
	}
	public set user(value: UserData)
	{
		this._user = value;
	}

	private _balance: Balance;
	public get balance(): Balance
	{
		if (this._balance)
		{
			return this._balance;
		}
		throw new Error(`User's balance did not load correctly!`);
	}
	public set balance(value: Balance)
	{
		this._balance = value;
	}

	/** Instantiates a GameObject in the game. */
	public Instantiate(gameObject: GameObject): void
	{
		gameObject.game = this;
		this._entities.push(gameObject);
	}

	public RegisterRenderer(renderer: IRendering)
	{
		this._renders.push(renderer);
	}

	/** Remove an Entity from this game. */
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

	/** **DEPRECATED** Destroys a GameObject from the game. */
	public Destroy(gameObject: GameObject): void
	{
		gameObject.game = null;
		this._entities.splice(this._entities.findIndex(e => e.entityId = gameObject.entityId), 1);
		return;

		throw new Error(`Could not find ${gameObject.gameObjectName} on this ${this.entityId} entity.`);
	}

	/** This is how the game is started up, it will run the functions to begin the game loop and initialization. */
	public Initialize(): Promise<void>
	{
		return new Promise((resolve) =>
		{
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
		window.requestAnimationFrame(() =>
		{
			this.Start();
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

		// Delay the game loop by one frame to make sure all entities and components have executed start.
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

		// Clear all renders in this game.
		for (const renderer of this.Renders)
		{
			renderer.Clear();
		}

		// Update all the entities in this game.
		for (const entity of this.Entities)
		{
			entity.Update(deltaTime);
		}

		// Draw all renders in this game.
		for (const renderer of this.Renders)
		{
			renderer.Draw();
		}

		this._lastTimestamp = Date.now();

		window.requestAnimationFrame(() => this.Update());
	}
}