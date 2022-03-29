import { CanvasLayer, Color, IFeature, Vector2 } from "src/app/game-engine/utils";
import { Game } from "../../game";

export class BackgroundFeature implements IFeature
{
	Entity: Game;

	Awake(): void
	{
		this.Draw();
	}

	Start(): void
	{
		
	}

	Update(deltaTime: number): void
	{

	}
	
	private Draw(): void
	{
		CanvasLayer.Background.FillRect(new Vector2(0, 0), CanvasLayer.Background.Size, new Color(210, 210, 210, 1));
	}

	private Clear(): void
	{
		
	}
}