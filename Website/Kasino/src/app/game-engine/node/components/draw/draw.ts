import { CanvasLayer, IComponent, Node, Settings } from 'src/app/game-engine';
import { Color, Vector2 } from 'src/app/game-engine/utils';

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

	private Draw(): void
	{
		CanvasLayer.Background.FillRect(this.Entity.Start, this.Entity.Size, Settings.grid.color);
	}

	private Clear(): void
	{
		// CanvasLayer.Background.ClearRect(
		// 	new Vector2(this.Position.x - Settings.grid.nodeSize / 2, this.Position.y - Settings.grid.nodeSize / 2),
		// 	new Vector2(Settings.grid.nodeSize, Settings.grid.nodeSize)
		// );
	}
}