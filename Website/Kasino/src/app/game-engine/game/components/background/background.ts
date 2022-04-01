import { CanvasLayer, Color, IFeature, Vector2 } from "src/app/game-engine/utils";
import { Game } from "../../game";

export class BackgroundFeature implements IFeature
{
	public Entity: Game;

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

	Dispose(): void
	{
		for (const prop in this)
		{
			delete this[ prop ];
		}
		//this.Entity.RemoveFeature(BackgroundFeature);
	}
	
	private Draw(): void
	{
		CanvasLayer.Background.FillRect(new Vector2(0, 0), CanvasLayer.Background.Size, new Color(210, 210, 210, 1));
	}

	private Clear(): void
	{
		
	}
}