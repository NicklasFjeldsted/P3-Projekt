import { Canvas, Vector2, Settings } from "src/app/game-engine";

export class CanvasLayer
{ 
	private static _layers: Canvas[] = [];
	public static get Layers(): Canvas[] { return this._layers; }

	private constructor() { }

	/** Returns a canvas with the Z-Index of the index parameter. */
	public static GetLayer(index: number): Canvas
	{
		if (!this._layers[ index ])
		{
			this._layers[ index ] = this.InitCanvas({ zIndex: index.toString() });
		}

		return this._layers[ index ];
	}

	/** Create a new canvas. */
	private static InitCanvas(style: Partial<CSSStyleDeclaration>): Canvas
	{
		let canvas = new Canvas(new Vector2(Settings.canvas.width, Settings.canvas.height));

		canvas.Awake();
		canvas.SetStyle(style);

		return canvas;
	}
}