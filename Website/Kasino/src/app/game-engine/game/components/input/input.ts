import { CanvasLayer, IComponent, Vector2, OnclickComponent } from "src/app/game-engine/utils";
import { Game } from "../../game";

export class GameInputComponent implements IComponent
{
	Entity: Game;

	Awake(): void
	{
		document.body.addEventListener('click', this.HandleClick.bind(this));
	}

	Update(deltaTime: number): void
	{

	}

	private HandleClick(event: MouseEvent): void
	{
		const point = CanvasLayer.Background.CalculateLocalPointFrom(new Vector2(event.clientX, event.clientY));
		if (!point)
		{
			return;
		}

		for (const entity of this.Entity.Entities)
		{
			if (!entity.HasComponent(OnclickComponent))
			{
				continue;
			}

			entity.GetComponent(OnclickComponent).ClickOn(point);
		}
	}
	
}