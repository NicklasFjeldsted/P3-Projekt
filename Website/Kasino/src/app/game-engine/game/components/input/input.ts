import { Subject } from "rxjs";
import { CanvasLayer, Vector2, OnclickComponent, IFeature } from "src/app/game-engine/utils";
import { Game } from "../..";

export class GameInputFeature implements IFeature
{
	public Entity: Game;
	public static OnClick: Subject<Vector2> = new Subject<Vector2>();

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

	private HandleClick(event: MouseEvent): void
	{
		const point: Vector2 | null = CanvasLayer.Background.CalculateLocalPointFrom(new Vector2(event.clientX, event.clientY));
		if (!point)
		{
			return;
		}

		GameInputFeature.OnClick.next(point);
	}
	
}