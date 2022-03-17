import { Settings } from "src/app/game-engine/settings";
import { Team } from "src/app/game-engine/team";
import { CanvasLayer, Color, IComponent, Vector2 } from "src/app/game-engine/utils";
import { Ship } from "../../ship";

export class ShipDrawComponent implements IComponent
{
	public Entity: Ship;

	private get Position(): Vector2
	{
		const position = this.Entity.Position;
		if (!position)
		{
			throw new Error('Attempted to draw sip that has no position!');
		}
		return position;
	};

	Awake(): void
	{
		this.Clear();
		this.Draw();
	}

	Update(deltaTime: number): void
	{

	}

	private Draw(): void
	{ 
		const colors = Settings.ships.colors;
		const color = this.Entity.Factory.Team === Team.A ? colors.a : colors.b;
		CanvasLayer.Foreground.FillCircle(this.Position, Settings.ships.radius, color);
	}

	private Clear(): void
	{
		CanvasLayer.Foreground.ClearRect(
			new Vector2(this.Position.x - Settings.grid.nodeSize / 2, this.Position.y - Settings.grid.nodeSize / 2),
			new Vector2(Settings.grid.nodeSize, Settings.grid.nodeSize)
		);
	}
}