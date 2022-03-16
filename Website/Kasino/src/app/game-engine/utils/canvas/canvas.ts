import { Vector2, IAwake, Color } from "src/app/game-engine";

export class Canvas implements IAwake
{
	constructor(public readonly Size: Vector2) { }

	private _element: HTMLCanvasElement;
	private _context: CanvasRenderingContext2D;

	public get Element(): HTMLCanvasElement
	{
		return this._element;
	}

	public get Context(): CanvasRenderingContext2D
	{
		return this._context;
	}

	public Awake(): void
	{
		const canvas = document.createElement('canvas');

		canvas.setAttribute('width', `${this.Size.x}px`);
		canvas.setAttribute('height', `${this.Size.y}px`);

		document.querySelector('game')!.appendChild(canvas);
		this._element = canvas;

		const ctx = this._element.getContext('2d')!;
		if (!ctx)
		{
			throw new Error('Context identifier is not supported.');
		}

		this._context = ctx;
	}

	// Add CSS styles to the canvas element.
	public SetStyle(style: Partial<CSSStyleDeclaration>): void
	{
		for (const key in style)
		{
			// If this object already has this type of style skip this iteration.
			if (!Object.hasOwnProperty.call(style, key))
			{
				continue;
			}

			// If the key string is null skip this iteration.
			if (!style[ key ])
			{
				continue;
			}

			// Set this canvas elements style equal to the current key's value.
			this._element.style[ key ] = style[ key ] as string;
		}
	}

	// Draws a square on the canvas.
	public FillRect(start: Vector2, size: Vector2, color: Color): void
	{
		this._context.beginPath();
		this._context.fillStyle = color.AsString();
		this._context.rect(start.x, start.y, size.x, size.y);
		this._context.fill();
	}

	// Draws a circle on the canvas.
	public FillCircle(center: Vector2, radius: number, color: Color): void
	{
		this._context.beginPath();
		this._context.arc(center.x, center.y, radius, 0, Math.PI * 2);
		this._context.fillStyle = color.AsString();
		this._context.fill();
	}

	// Clear a square on the canvas.
	public ClearRect(start: Vector2, size: Vector2): void
	{
		this._context.clearRect(start.x, start.y, size.x, size.y);
	}
}