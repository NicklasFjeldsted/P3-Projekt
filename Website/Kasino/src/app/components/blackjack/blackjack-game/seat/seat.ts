import { of, Subject } from "rxjs";
import { ColliderComponent, GameInputFeature, GameObject, MonoBehaviour, SpriteRendererComponent, TextComponent, Vector2, Vector3 } from "src/app/game-engine";
import { House } from "../house";
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
	private seatText: TextComponent;
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
		this.seatText = seatText.GetComponent(TextComponent);

		let cardsChild = new GameObject(`${this.gameObject.gameObjectName}'s Child`);
		cardsChild.SetParent(this.gameObject);
		cardsChild.AddComponent(new TextComponent(' '));
		cardsChild.transform.Translate(new Vector3(0, -30, 0));
		this.childTextComponent = cardsChild.GetComponent(TextComponent);

		GameInputFeature.OnClick.subscribe(event => this.OnClicked(event));
	}

	public Update(deltaTime: number): void
	{
		var clients = House.Instance.clients;
		for (const key in clients)
		{
			if (clients[key].seatIndex === this.seatIndex && this.Player! !== House.Instance.client)
			{
				this.Player = new Player();
				this.Player.UpdateData(clients[ key ]);
			}
			else if (clients[ key ].seatIndex === this.seatIndex && this.Player! === House.Instance.client)
			{
				this.Player.UpdateData(clients[ key ]);
			}
		}

		this.Display();
	}

	public ResetSeat(): void
	{
		this.Player = null;
	}

	/** Updates the seat and the playerdata if the player isnt null, if it is throws and error. */
	// public UpdateSeat(playerData: PlayerData): void
	// {
	// 	if (this.Player)
	// 	{
	// 		this.Player.UpdateData(playerData);
	// 		return;
	// 	}
	// 	throw new Error(`Null Reference Error:\n Seat-Number: ${this.seatIndex}'s Player is null.`);
	// }

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

	/** Display the current card value of the player sitting in this seat. */
	public Display(): void
	{
		if (!this.Player) return;

		this.childTextComponent.text = this.Player.cardValues.toString();
		this.seatText.text = this.Player.data.fullName;
	}

	/** Join a seat. Throws an error if the seat already has a player. */
	public JoinSeat(): void
	{
		if (!this.Player)
		{
			this.Player = House.Instance.client;
			this.Player.data.seated = true;
			this.Player.data.seatIndex = this.seatIndex;
	
			this.OnSeatJoined.next(this.Player.data);
			return;
		}
		throw new Error(`Exists Error:\n Seat-Number: ${this.seatIndex}'s Player is not null.`);
	}

	/** Leave a seat. Throws an error if the seat does not contains a player. */
	public LeaveSeat(): void
	{
		if (this.Player)
		{
			this.Player.data.seated = false;
			this.Player.data.seatIndex = -1;
			this.Player = null;
			return;
		}
		throw new Error(`Null Reference Error:\n Seat-Number: ${this.seatIndex}'s Player is null.`);
	}
}