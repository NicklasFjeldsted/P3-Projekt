import { Subject } from "rxjs";
import { CanvasLayer, Vector2, IFeature } from "src/app/game-engine/utils";
import { Game } from "../..";

export class GameInputFeature implements IFeature
{
	public Entity: Game;
	public OnMouseUp: Subject<Vector2> = new Subject<Vector2>();
	public OnMouseDown: Subject<Vector2> = new Subject<Vector2>();

	Awake(): void
	{
		document.body.addEventListener('mousedown', this.HandleMouseDown.bind(this));
		document.body.addEventListener('mouseup', this.HandleMouseUp.bind(this));
	}

	Start(): void
	{
		
	}

	Update(deltaTime: number): void
	{

	}

	private HandleMouseDown(event: MouseEvent): void
	{
		const point: Vector2 | null = CanvasLayer.GetLayer(2).CalculateLocalPointFrom(new Vector2(event.clientX, event.clientY));
		if (!point)
		{
			return;
		}
		this.OnMouseDown.next(point);
	}
	
	private HandleMouseUp(event: MouseEvent): void
	{
		const point: Vector2 | null = CanvasLayer.GetLayer(2).CalculateLocalPointFrom(new Vector2(event.clientX, event.clientY));
		if (!point)
		{
			return;
		}
		this.OnMouseUp.next(point);
	}
}