import { OnclickComponent, Vector2 } from "src/app/game-engine/utils";
import { Grid } from "../../grid";

export class GridOnclickComponent extends OnclickComponent
{
	public Entity: Grid;

	public Awake(): void
	{
		
	}

	public Update(deltaTime: number): void
	{
		
	}

	public ClickOn(point: Vector2): void
	{
		for (const node of this.Entity.Nodes)
		{
			node.IsActive = node.Occupies(point);
		}
	}
}