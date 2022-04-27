import { Subject } from "rxjs";
import { CanvasLayer, Vector2, IFeature } from "src/app/game-engine/utils";
import { Game } from "../..";

export class GameInputFeature implements IFeature
{
	public Entity: Game;
	public OnClick: Subject<Vector2> = new Subject<Vector2>();

	Awake(): void
	{
		document.body.addEventListener('click', this.HandleClick.bind(this));
	}

	Start(): void
	{
		
	}

	Update(deltaTime: number): void
	{

	}

	Dispose(): void
	{
		this.Entity.RemoveFeature(GameInputFeature);
	}

	private HandleClick(event: MouseEvent): void
	{
		const point: Vector2 | null = CanvasLayer.GetLayer(2).CalculateLocalPointFrom(new Vector2(event.clientX, event.clientY));
		if (!point)
		{
			return;
		}
		this.OnClick.next(point);
	}
	
}