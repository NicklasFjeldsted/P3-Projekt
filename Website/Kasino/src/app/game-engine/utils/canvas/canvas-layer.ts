import { Canvas, Vector2, Settings } from "src/app/game-engine";

export class CanvasLayer
{ 
	private static _layers: Canvas[] = [];

	private constructor() { }

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
		let size = (Settings.grid.nodeSize + Settings.grid.nodeOffset) * Settings.grid.dimension + Settings.grid.nodeOffset;
		let canvas = new Canvas(new Vector2(960, 600));

		canvas.Awake();
		canvas.SetStyle(style);

		return canvas;
	}
}