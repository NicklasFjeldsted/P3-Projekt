import { MonoBehaviour, SpriteRendererComponent, Vector2 } from "src/app/game-engine";

export class CardObject extends MonoBehaviour
{
	public index: number;
	public renderer: SpriteRendererComponent;
	private startPosition: Vector2;

	public Start(): void
	{
		this.startPosition = new Vector2(this.transform.position.x, this.transform.position.y);
	}

	public Awake(): void
	{
		this.renderer = this.gameObject.AddComponent(new SpriteRendererComponent()).GetComponent(SpriteRendererComponent);
		this.transform.scale = new Vector2(75, 101);
	}

	public Update(deltaTime: number): void
	{
		
	}

	public ResetPosition(): void
	{
		this.transform.position = new Vector2(this.startPosition.x, this.startPosition.y);
	}
}