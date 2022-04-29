import { Vector2, IAwake, Color, Shape, CustomRadius } from "src/app/game-engine";

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

	/** Draws a rect on the canvas. */
	public FillRect(start: Vector2, size: Vector2, color: Color = new Color(50, 205, 50, 1)): void
	{
		this._context.beginPath();
		this._context.fillStyle = color.AsString();
		this._context.rect(start.x, start.y, size.x, size.y);
		this._context.fill();
	}

	/** Draw a custom rect on the canvas. */
	public ExtendedRect(start: Vector2, size: Vector2, shape: Shape): void
	{
		let localRadius: CustomRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
		this._context.lineWidth = shape.outlineWidth;
		this._context.strokeStyle = shape.outlineColor.AsString();
		this._context.fillStyle = shape.fillColor.AsString();

		//outlineWidth = Math.min(Math.min(size.x, 1), Math.min(size.y, 1), outlineWidth);
		
		if (typeof shape.radius === 'number')
		{
			localRadius = { tl: shape.radius, tr: shape.radius, br: shape.radius, bl: shape.radius };
		}
		else
		{
			localRadius = Object.assign(localRadius, shape.radius);
		}

		this._context.beginPath();
		this._context.moveTo(start.x + localRadius.tl, start.y);
		this._context.lineTo(start.x + size.x - localRadius.tr, start.y);
		this._context.quadraticCurveTo(start.x + size.x, start.y, start.x + size.x, start.y + localRadius.tr);
		this._context.lineTo(start.x + size.x, start.y + size.y - localRadius.br);
		this._context.quadraticCurveTo(start.x + size.x, start.y + size.y, start.x + size.x - localRadius.br, start.y + size.y);
		this._context.lineTo(start.x + localRadius.bl, start.y + size.y);
		this._context.quadraticCurveTo(start.x, start.y + size.y, start.x, start.y + size.y - localRadius.bl);
		this._context.lineTo(start.x, start.y + localRadius.tl);
		this._context.quadraticCurveTo(start.x, start.y, start.x + localRadius.tl, start.y);
		this._context.closePath();

		if (shape.fill)
		{
			this._context.fill();
		}

		if (shape.outline)
		{
			let ow = shape.outlineWidth / 2;
			this._context.beginPath();
			this._context.moveTo(start.x + localRadius.tl + ow, start.y + ow);
			this._context.lineTo(start.x + size.x - localRadius.tr - ow, start.y + ow);
			this._context.quadraticCurveTo(start.x + size.x - ow, start.y + ow, start.x + size.x - ow, start.y + localRadius.tr);
			this._context.lineTo(start.x + size.x - ow, start.y + size.y - localRadius.br - ow);
			this._context.quadraticCurveTo(start.x + size.x - ow, start.y + size.y - ow, start.x + size.x - localRadius.br, start.y + size.y - ow);
			this._context.lineTo(start.x + localRadius.bl, start.y + size.y - ow);
			this._context.quadraticCurveTo(start.x + ow, start.y + size.y - ow, start.x + ow, start.y + size.y - localRadius.bl);
			this._context.lineTo(start.x + ow, start.y + localRadius.tl);
			this._context.quadraticCurveTo(start.x + ow, start.y + ow, start.x + localRadius.tl, start.y + ow);
			this._context.closePath();
			this._context.stroke();
		}
	}

	/** Draws a box on the canvas. */
	public StrokeRect(start: Vector2, size: Vector2, color: Color = new Color(50, 205, 50, 1)): void
	{
		this._context.beginPath();
		this._context.strokeStyle = color.AsString();
		this._context.rect(start.x, start.y, size.x, size.y);
		this._context.stroke();
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
		let _start = new Vector2(start.x, start.y);
		let _size = new Vector2(size.x, size.y);

		this._context.clearRect(_start.x, _start.y, _size.x + 1, _size.y + 1);
	}

	/** Clears an entire canvas. */
	public ClearCanvas(): void
	{
		this._context.clearRect(0, 0, this._element.width, this._element.height);
	}

	/** Draw text the canvas and return the width of it. */
	public DrawText(text: string, position: Vector2, fontSize: number = 16, maxWidth?: number, fit: boolean = false, color?: Color): void
	{
		let _margin: number = 0;

		this._context.textAlign = "center";
		this._context.textBaseline = "middle";
		
		let desiredWidth = maxWidth ? maxWidth : this._context.measureText(text).width;

		if (fit)
		{
			do
			{
				fontSize--;
				_margin = Math.round(fontSize / 2);
				this._context.font = `${fontSize}px Arial`;
			}
			while (this._context.measureText(text).width > desiredWidth - _margin);
		}
		else
		{
			_margin = Math.round(fontSize / 2);
			this._context.font = `${fontSize}px Arial`;
		}


		this._context.fillText(text, position.x, position.y, desiredWidth - _margin);
	}

	/** Return the pixel width of a string. */
	public MeasureText(text: string): number
	{
		return this._context.measureText(text).width;
	}

	/** Draws and image to the canvas. */
	public DrawImage(source: string, start: Vector2, size: Vector2, color?: Color): void
	{
		let image = new Image();
		image.src = source;

		if (image.src === '')
		{
			throw new Error('Image source not specified.');
		}

		this._context.drawImage(image, start.x, start.y, size.x, size.y);

		if (this.IsInverted(size.x, size.y))
		{
			this.RecolorImage(image, size.x, size.y, start, new Color(255, 0, 0, 1));
		}
		else if (color)
		{
			this.RecolorImage(image, size.x, size.y, start, color);
		}
	}

	/** Overlays a new color on the image. */
	private RecolorImage(image: HTMLImageElement, width: number, height: number, position: Vector2, newColor: Color)
	{
		// pull the entire image into an array of pixel data
		var imageData = this._context.getImageData(position.x, position.y, width, height);

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
		this._context.putImageData(imageData, position.x, position.y);
	}

	/** Checks if the image rendered has been inverted. I.E. it folds over itself. */
	private IsInverted(width: number, height: number): boolean
	{
		if (width.toString().includes('-') || height.toString().includes('-'))
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}