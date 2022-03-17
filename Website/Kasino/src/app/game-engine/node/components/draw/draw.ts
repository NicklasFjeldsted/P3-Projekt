import { CanvasLayer, IComponent, Node, Settings } from 'src/app/game-engine';

export class NodeDrawComponent implements IComponent
{
	public gameObject: Node;

	Awake(): void
	{
		this.Draw();
	}

	Update(deltaTime: number): void
	{
		this.Clear();
		this.Draw();
	}

	/** Draw a node to the canvas. */
	private Draw(): void
	{
		CanvasLayer.Background.FillRect(this.gameObject.Start, this.gameObject.Size, this.gameObject.IsActive ? Settings.grid.color.active : Settings.grid.color.regular);
	}

	/** Clear a node from the canvas. */
	private Clear(): void
	{
		CanvasLayer.Background.ClearRect(this.gameObject.Start, this.gameObject.Size);
	}
}