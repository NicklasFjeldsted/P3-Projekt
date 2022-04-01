import { of, Subject } from "rxjs";
import { ColliderComponent, Game, GameInputFeature, GameObject, MonoBehaviour, SpriteRendererComponent, TextComponent, Vector2, Vector3 } from "src/app/game-engine";
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
	public myTurn: boolean = false;
	
	public OnSeatJoined: Subject<PlayerData> = new Subject<PlayerData>();
	
	private childTextComponent: TextComponent;
	private seatText: TextComponent;
	private collider: ColliderComponent;
	private hitButtonCollider: ColliderComponent;
	private standButtonCollider: ColliderComponent;
	private house: House;

	public Start(): void
	{
		this.transform.scale = new Vector3(.1, .1, .1);
		this.collider = this.gameObject.GetComponent(ColliderComponent);
		this.standButtonCollider.gameObject.transform.Translate(new Vector3(50, 0, 0));
		this.standButtonCollider.Size = new Vector2(50, 30);
		this.hitButtonCollider.Size = new Vector2(50, 30);
		this.house = this.gameObject.parent.GetComponent(House);
	}

	public Awake(): void
	{
		this.gameObject.AddComponent(new SpriteRendererComponent('../../../../../assets/media/blackjack-game/circle.png'));
		this.gameObject.AddComponent(new ColliderComponent());
		
		let seatText = new GameObject(`${this.gameObject.gameObjectName}'s Text`);
		this.gameObject.game.Instantiate(seatText);
		seatText.SetParent(this.gameObject);
		seatText.AddComponent(new TextComponent(this.gameObject.gameObjectName));
		this.seatText = seatText.GetComponent(TextComponent);

		let cardsChild = new GameObject(`${this.gameObject.gameObjectName}'s Child`);
		this.gameObject.game.Instantiate(cardsChild);
		cardsChild.SetParent(this.gameObject);
		cardsChild.AddComponent(new TextComponent(' '));
		cardsChild.transform.Translate(new Vector3(0, -30, 0));
		this.childTextComponent = cardsChild.GetComponent(TextComponent);

		let buttons = new GameObject(`${this.gameObject.gameObjectName}'s buttons`);
		this.gameObject.game.Instantiate(buttons);
		buttons.SetParent(this.gameObject);
		buttons.transform.Translate(new Vector3(0, -60, 0));
		
		let hitButton = new GameObject(`${buttons.gameObjectName}'s Hit Button`);
		this.gameObject.game.Instantiate(hitButton);
		hitButton.SetParent(buttons);
		hitButton.AddComponent(new TextComponent("Hit"));
		hitButton.AddComponent(new ColliderComponent());
		this.hitButtonCollider = hitButton.GetComponent(ColliderComponent);

		let standButton = new GameObject(`${buttons.gameObjectName}'s Stand Button`);
		this.gameObject.game.Instantiate(standButton);
		standButton.SetParent(buttons);
		standButton.AddComponent(new TextComponent("Stand"));
		standButton.AddComponent(new ColliderComponent());
		this.standButtonCollider = standButton.GetComponent(ColliderComponent);

		this.gameObject.game.GetFeature(GameInputFeature).OnClick.subscribe(event => this.OnClicked(event));
	}

	public Update(deltaTime: number): void
	{
		// this.standButtonCollider.gameObject.isActive = this.myTurn;
		// this.hitButtonCollider.gameObject.isActive = this.myTurn;
	}

	public UpdateSeat(data: PlayerData): void
	{
		if (!this.Player)
		{
			this.Player = new Player();
		}

		this.Player.UpdateData(data);
	}

	public ResetSeat(): void
	{
		this.Player = null;
	}

	private OnClicked(point: Vector2): void
	{
		if (this.collider.Hit(point))
		{
			if (this.Occupied)
			{
				return;
			}
			this.JoinSeat();
		}

		if (!this.myTurn)
		{
			return;
		}

		if (this.hitButtonCollider.Hit(point))
		{
			console.log(`${this.gameObject.gameObjectName} hits.`);
		}

		if (this.standButtonCollider.Hit(point))
		{
			console.log(`${this.gameObject.gameObjectName} stands.`);
		}
	}

	/** Display the current card value of the player sitting in this seat. */
	public Display(): void
	{
		if (!this.Player)
		{
			this.childTextComponent.text = ' ';
			this.seatText.text = this.gameObject.gameObjectName;
			return;
		}

		this.childTextComponent.text = this.Player.cardValues.toString();
		this.seatText.text = this.Player.data.fullName;
	}

	/** Join a seat. Throws an error if the seat already has a player. */
	public JoinSeat(): void
	{
		if (!this.Player)
		{
			this.Player = this.house.client;
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