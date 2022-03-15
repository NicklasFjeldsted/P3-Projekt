import { Grid } from '../grid';
import { Settings } from '../settings';
import { Entity } from '../utils';

export class Game extends Entity
{
	constructor(private parent: Element)
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

		this._entities.push(new Grid())

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

		this.DirtyDraw();
	}

	// Update the game everyframe and calculate the new deltaTime.
	public override Update(): void
	{
		const deltaTime = (Date.now() - this._lastTimestamp) / 1000;

		super.Update(deltaTime);

		// Update all the entities in the game.
		for (const entity of this.Entities)
		{
			entity.Update(deltaTime);
		}

		this._lastTimestamp = Date.now();

		window.requestAnimationFrame(() => this.Update());
	}

	private DirtyDraw(): void
	{
		const canvas = document.createElement('canvas');

		const canvasSize = (Settings.grid.nodeSize + Settings.grid.nodeOffset) * Settings.grid.dimension + Settings.grid.nodeOffset;

		canvas.setAttribute('width', canvasSize.toString());
		canvas.setAttribute('height', canvasSize.toString());

		this.parent.appendChild(canvas);

		const size = Settings.grid.nodeSize;
		const offset = Settings.grid.nodeOffset;

		for (let y = 0; y < Settings.grid.dimension; y++)
		{
			for (let x = 0; x < Settings.grid.dimension; x++)
			{
				const ctx = canvas.getContext('2d')!;
				ctx.beginPath();
				ctx.fillStyle = Settings.grid.color;
				ctx.rect((size + offset) * x, (size + offset) * y, size, size);
				ctx.fill();
			}
		}
	}
}