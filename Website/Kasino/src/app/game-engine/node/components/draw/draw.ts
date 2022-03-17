import { CanvasLayer, IComponent, Node, Settings } from 'src/app/game-engine';

export class NodeDrawComponent implements IComponent
{
	public Entity: Node;

	Awake(): void
	{
		this.Draw();
	}

	Update(deltaTime: number): void
	{

	}

	/** Draw a node to the canvas. */
	private Draw(): void
	{
		CanvasLayer.Background.FillRect(this.Entity.Start, this.Entity.Size, Settings.grid.color);
	}

	/** Clear a node from the canvas. */
	private Clear(): void
	{
		CanvasLayer.Background.ClearRect(this.Entity.Start, this.Entity.Size);
	}
}