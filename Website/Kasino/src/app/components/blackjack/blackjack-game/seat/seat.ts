import { ColliderComponent, GameInputFeature, GameObject, MonoBehaviour, SpriteRendererComponent, TextComponent, Vector2, Vector3 } from "src/app/game-engine";
import { Card } from "../cards";
import { House } from "../house";
import { Player } from "../player";

export class Seat extends MonoBehaviour
{
	public Player: Player | null;
	private collider: ColliderComponent;
	public HeldCards: Card[] = [];
	public cardValues: number;

	private childTextComponent: TextComponent;

	constructor(private _player?: Player)
	{
		super();
		_player ? this.Player = _player : this.Player = null;
	}

	public Start(): void
	{
		this.transform.scale = new Vector3(.1, .1, .1);
		this.collider = this.gameObject.GetComponent(ColliderComponent);
	}

	public Awake(): void
	{
		this.gameObject.AddComponent(new SpriteRendererComponent('../../../../../assets/media/blackjack-game/circle.png'));
		this.gameObject.AddComponent(new ColliderComponent());
		this.gameObject.AddComponent(new TextComponent(this.gameObject.gameObjectName));
		let cardsChild = new GameObject(`${this.gameObject.gameObjectName}'s Child`);
		cardsChild.SetParent(this.gameObject);
		cardsChild.AddComponent(new TextComponent(' '));
		cardsChild.transform.Translate(new Vector3(0, -30, 0));
		this.childTextComponent = cardsChild.GetComponent(TextComponent);
		GameInputFeature.OnClick.subscribe(event => this.OnClicked(event));
	}

	public Update(deltaTime: number): void
	{

	}

	private OnClicked(point: Vector2): void
	{
		if (!this.collider.Hit(point))
		{
			return;
		}

		this.Player = House.Instance._localPlayer;
		this.Player.seat = this;
	}

	public UpdateCards(card: Card): void
	{
		this.HeldCards.push(card);
		this.DisplayCards();
	}

	public DisplayCards(): void
	{
		var cardValues: number = 0;
		for (const card of this.HeldCards)
		{
			cardValues += card.value;
		}
	}
}