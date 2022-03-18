import { Vector2, IAwake, Color, Transform } from "src/app/game-engine";

export class Canvas implements IAwake
{
	constructor(public readonly Size: Vector2) { }

	private _element: HTMLCanvasElement;
	private _context: CanvasRenderingContext2D;

	/** Public getter for the canvas element. */
	public get Element(): HTMLCanvasElement
	{
		return this._element;
	}

	/** Public getter for the context of the 2D canvas rendering. */
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

	/** Calculates the local canvas mouse position from the global mouse position. */
	public CalculateLocalPointFrom(globalPoint: Vector2): Vector2 | null
	{
		const canvasRect = this._element.getBoundingClientRect();
		const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

		const offset = {
			top: canvasRect.top + scrollTop,
			left: canvasRect.left + scrollLeft
		}

		const x = globalPoint.x - offset.left;
		const y = globalPoint.y - offset.top;

		if (x < 0 || y < 0)
		{
			return null;
		}

		if (x > offset.left + canvasRect.width || y > offset.top + canvasRect.height)
		{
			return null;
		}

		return new Vector2(x, y);
	}

	/** Add CSS styles to the canvas element. */
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

	/** Draws a square on the canvas. */
	public FillRect(start: Vector2, size: Vector2, color: Color): void
	{
		this._context.beginPath();
		this._context.fillStyle = color.AsString();
		this._context.rect(start.x, start.y, size.x, size.y);
		this._context.fill();
	}

	/** Draws a circle on the canvas. */
	public FillCircle(center: Vector2, radius: number, color: Color): void
	{
		this._context.beginPath();
		this._context.arc(center.x, center.y, radius, 0, Math.PI * 2);
		this._context.fillStyle = color.AsString();
		this._context.fill();
	}

	/** Clear a rect from the canvas. */
	public ClearRect(start: Vector2, size: Vector2): void
	{
		this._context.clearRect(start.x, start.y, size.x, size.y);
	}

	/** Draws and image to the canvas. */
	public DrawImage(source: string, transform: Transform, color?: Color): void
	{
		let image = new Image();
		image.src = source;

		if (image.src === '') 
		{
			throw new Error('Image source not specified.');
		}

		image.onload = () =>
		{
			const width = image.naturalWidth * transform.scale.x;
			const height = image.naturalHeight * transform.scale.y;
			this._context.drawImage(image, transform.position.x, transform.position.y, width, height);
			if (color)
			{
				this.recolorImage(image, color);
			}
		}
	}

	private recolorImage(image: HTMLImageElement, newColor: Color)
	{
		// pull the entire image into an array of pixel data
		var imageData = this._context.getImageData(0, 0, image.naturalWidth, image.naturalHeight);

		// examine every pixel, 
		// change any old rgb to the new-rgb
		for (let i=0; i < imageData.data.length; i+=4)
		{
			// change to your new rgb
			imageData.data[ i ] = newColor.R;
			imageData.data[ i + 1 ] = newColor.G;
			imageData.data[ i + 2 ] = newColor.B;
		}
		// put the altered data back on the canvas  
		this._context.putImageData(imageData, 0, 0);
	}
}