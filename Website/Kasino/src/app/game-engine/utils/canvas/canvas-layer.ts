import { Canvas, Vector2, Settings } from "src/app/game-engine";

export class CanvasLayer
{ 
	private static _background: Canvas;
	private static _foreground: Canvas;

	private constructor() { }
	
	// Return the background canvas layer if it exists else create it and return it.
	public static get Background(): Canvas
	{
		if (!this._background)
		{
			this._background = this.InitCanvas({ zIndex: '0' });
		}

		return this._background;
	}

	// Return the foreground canvas layer if it exists else create it and return it.
	public static get Foreground(): Canvas
	{
		if (!this._foreground)
		{
			this._foreground = this.InitCanvas({ zIndex: '1' });
		}

		return this._foreground;
	}

	// Create a new canvas.
	private static InitCanvas(style: Partial<CSSStyleDeclaration>): Canvas
	{
		const size = (Settings.grid.nodeSize + Settings.grid.nodeOffset) * Settings.grid.dimension + Settings.grid.nodeOffset;
		const canvas = new Canvas(new Vector2(size, size));

		canvas.Awake();
		canvas.SetStyle(style);

		return canvas;
	}
}