import { Subject } from "rxjs";
import { ColliderComponent, GameInputFeature, GameObject, MonoBehaviour, SpriteRendererComponent, TextComponent, Vector2, Vector3 } from "src/app/game-engine";
import { Player, PlayerData } from "../player";

export class Seat extends MonoBehaviour
{
	public Player: Player | null;
	
	public get Occupied(): boolean
	{
		return this.Player ? true : false;
	}

	public seatIndex: number;
	
	public OnSeatJoined: Subject<PlayerData> = new Subject<PlayerData>();
	
	private childTextComponent: TextComponent;
	private collider: ColliderComponent;

	public Start(): void
	{
		this.transform.scale = new Vector3(.1, .1, .1);
		this.collider = this.gameObject.GetComponent(ColliderComponent);
	}

	public Awake(): void
	{
		this.gameObject.AddComponent(new SpriteRendererComponent('../../../../../assets/media/blackjack-game/circle.png'));
		this.gameObject.AddComponent(new ColliderComponent());
		
		let seatText = new GameObject(`${this.gameObject.gameObjectName}'s Text`);
		seatText.SetParent(this.gameObject);
		seatText.AddComponent(new TextComponent(this.gameObject.gameObjectName));

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

	public ResetSeat(): void
	{
		this.Player = null;
	}

	/** Updates the seat and the playerdata if the player isnt null, if it is throws and error. */
	public UpdateSeat(playerData: PlayerData): void
	{
		if (this.Player)
		{
			this.Player.UpdateData(playerData);
			return;
		}
		throw new Error(`Null Reference Error:\n Seat-Number: ${this.seatIndex}'s Player is null.`);
	}

	private OnClicked(point: Vector2): void
	{
		if (!this.collider.Hit(point))
		{
			return;
		}

		if (this.Occupied)
		{
			return;
		}

		this.JoinSeat();
	}

	/** Display the current card value of the player sitting in this seat, throws an error if the player is null. */
	public DisplayCards(): void
	{
		if (this.Player)
		{
			this.childTextComponent.text = this.Player.cardValues.toString();
			return;
		}
		throw new Error(`Null Reference Error:\n Seat-Number: ${this.seatIndex}'s Player is null.`);
	}

	public JoinSeat(): void
	{
		
	}

	public LeaveSeat()
	{
		return null;
	}

}