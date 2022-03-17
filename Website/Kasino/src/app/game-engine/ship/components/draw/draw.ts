import { GameObject } from "src/app/game-engine/gameObject";
import { Settings } from "src/app/game-engine/settings";
import { Team } from "src/app/game-engine/team";
import { CanvasLayer, Color, IComponent, Vector2 } from "src/app/game-engine/utils";
import { Ship } from "../../ship";

export class ShipDrawComponent implements IComponent
{
	public gameObject: GameObject;

	// Get the position of this entity for drawing the ship to the canvas.
	// It will throw an error if the position of the entity is null.
	private get Position(): Vector2
	{
		const position = this.gameObject.transform.position;
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

	/** Draw a ship to the canvas. */
	private Draw(): void
	{ 
		const colors = Settings.ships.colors;
		//const color = this.gameObject.Factory.Team === Team.A ? colors.a : colors.b;
		//CanvasLayer.Foreground.FillCircle(this.Position, Settings.ships.radius, color);
	}

	/** Clear a ship from the canvas. */
	private Clear(): void
	{
		CanvasLayer.Foreground.ClearRect(
			new Vector2(this.Position.x - Settings.grid.nodeSize / 2, this.Position.y - Settings.grid.nodeSize / 2),
			new Vector2(Settings.grid.nodeSize, Settings.grid.nodeSize)
		);
	}
}