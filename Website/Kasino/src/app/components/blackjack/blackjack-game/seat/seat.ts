import { Subject } from "rxjs";
import { ColliderComponent, Game, GameInputFeature, GameObject, MonoBehaviour, NetworkingFeature, SpriteRendererComponent, TextComponent, Vector2 } from "src/app/game-engine";
import { GameStage, House } from "../house";
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
	private resultTextChildComponent: TextComponent;
	private seatText: TextComponent;
	private collider: ColliderComponent;
	private hitButtonCollider: ColliderComponent;
	private standButtonCollider: ColliderComponent;
	private house: House;
	private displayedCards: GameObject[] = [];

	public Start(): void
	{
		this.collider = this.gameObject.GetComponent(ColliderComponent);
		this.house = this.gameObject.parent.GetComponent(House);
	}

	public Awake(): void
	{
		for (let i = 0; i < 6; i++)
		{
			this.CreateCardDisplay(i);
		}

		this.gameObject.AddComponent(new SpriteRendererComponent('../../../../../assets/media/blackjack-game/circle.png'));
		this.gameObject.AddComponent(new ColliderComponent());
		//console.log(`${this.gameObject.gameObjectName} - Components: `, this.gameObject.Components);
		
		let seatText = new GameObject(`${this.gameObject.gameObjectName}'s Text`);
		this.gameObject.game.Instantiate(seatText);
		seatText.transform.scale = new Vector2(100, 30);
		seatText.SetParent(this.gameObject);
		seatText.AddComponent(new TextComponent(this.gameObject.gameObjectName));
		this.seatText = seatText.GetComponent(TextComponent);

		let cardsChild = new GameObject(`${this.gameObject.gameObjectName}'s Child`);
		this.gameObject.game.Instantiate(cardsChild);
		cardsChild.SetParent(this.gameObject);
		cardsChild.AddComponent(new TextComponent(' '));
		cardsChild.transform.Translate(new Vector2(0, -30));
		this.childTextComponent = cardsChild.GetComponent(TextComponent);

		let buttons = new GameObject(`${this.gameObject.gameObjectName}'s buttons`);
		this.gameObject.game.Instantiate(buttons);
		buttons.transform.scale = new Vector2(100, 30);
		buttons.SetParent(this.gameObject);
		buttons.transform.Translate(new Vector2(0, -60));
		buttons.AddComponent(new SpriteRendererComponent('../../../../../assets/announcer.jpg'));
		
		let hitButton = new GameObject(`${buttons.gameObjectName}'s Hit Button`);
		this.gameObject.game.Instantiate(hitButton);
		hitButton.SetParent(buttons);
		hitButton.transform.scale = new Vector2(50, 30);
		hitButton.transform.Translate(new Vector2(0, 24));
		hitButton.AddComponent(new TextComponent("Hit"));
		hitButton.AddComponent(new ColliderComponent());
		this.hitButtonCollider = hitButton.GetComponent(ColliderComponent);
		
		let standButton = new GameObject(`${buttons.gameObjectName}'s Stand Button`);
		this.gameObject.game.Instantiate(standButton);
		standButton.SetParent(buttons);
		standButton.transform.scale = new Vector2(50, 30);
		standButton.AddComponent(new TextComponent("Stand"));
		standButton.AddComponent(new ColliderComponent());
		standButton.transform.Translate(new Vector2(50, 0));
		this.standButtonCollider = standButton.GetComponent(ColliderComponent);

		let resultTextChild = new GameObject(`${this.gameObject.gameObjectName}'s Result Child`);
		this.gameObject.game.Instantiate(resultTextChild);
		resultTextChild.transform.scale = new Vector2(100, 30);
		resultTextChild.SetParent(this.gameObject);
		resultTextChild.AddComponent(new TextComponent('@result'));
		resultTextChild.transform.Translate(new Vector2(0, -90));
		this.resultTextChildComponent = resultTextChild.GetComponent(TextComponent);
		this.resultTextChildComponent.renderLayer = -1;

		this.gameObject.game.GetFeature(GameInputFeature).OnClick!.subscribe(event => this.OnClicked(event));
	}

	public Update(deltaTime: number): void
	{

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

		if (this.house.client != this.Player)
		{
			return;
		}

		if (this.hitButtonCollider.Hit(point))
		{
			this.gameObject.game.GetFeature(NetworkingFeature).Send("Hit");
		}
		
		if (this.standButtonCollider.Hit(point))
		{
			this.gameObject.game.GetFeature(NetworkingFeature).Send("Stand");
		}
	}

	public UpdateIsMyTurn(newValue: boolean): void
	{
		this.myTurn = newValue;

		this.standButtonCollider.gameObject.isActive = this.myTurn;
		this.hitButtonCollider.gameObject.isActive = this.myTurn;
	}

	/** Display this seat. */
	public Display(): void
	{
		this.UpdateIsMyTurn(this.myTurn);

		if (!this.Player)
		{
			this.childTextComponent.text = ' ';
			this.resultTextChildComponent.text = ' ';
			this.seatText.text = this.gameObject.gameObjectName;
			this.ClearCards();
			return;
		}

		if (this.house.stage == GameStage.Ended)
		{
			setTimeout(() => this.ClearCards(), 4000);
			if (this.Player.data.winner == true)
			{
				this.resultTextChildComponent.text = "WIN!";
			}
			else if(this.Player.data.winner == false)
			{
				this.resultTextChildComponent.text = "LOSE!";
			}
		}
		else if (this.house.stage == GameStage.Started)
		{
			this.resultTextChildComponent.text = ' ';
			this.childTextComponent.text = this.Player.cardValues.toString();
			this.seatText.text = this.Player.data.fullName;
			for (let card of this.Player.data.cards)
			{
				if (!this.IsCardDisplayed(card.id))
				{
					this.DisplayCard(card.id);
				}
			}
		}
		else if (this.house.stage == GameStage.Off)
		{
			this.resultTextChildComponent.text = ' ';
			this.seatText.text = this.Player.data.fullName;
			this.ClearCards();
		}
	}

	private IsCardDisplayed(cardID: number): boolean
	{
		for (let displayCard of this.displayedCards)
		{
			let renderer = displayCard.GetComponent(SpriteRendererComponent);

			if (renderer.image == null) continue;

			if (!renderer.image.includes(`${cardID}`)) continue;

			return true;
		}

		return false;
	}

	/** Loads a card PNG and displays it. */
	private DisplayCard(cardID: number): void
	{
		if (!this.Player) return;

		let imagePath: string = `../../../../../assets/media/blackjack-game/cards/${cardID}.png`;
		
		for (let displayCard of this.displayedCards)
		{
			let renderer = displayCard.GetComponent(SpriteRendererComponent);

			if (renderer.image != null) continue;

			renderer.image = imagePath;
			return;
		}

		throw new Error(`${this.gameObject.gameObjectName} - NO CARD OBJECT! - `);
	}

	private ClearCards(): void
	{
		for (let displayCard of this.displayedCards)
		{
			displayCard.GetComponent(SpriteRendererComponent).image = null;
		}
	}

	/** Creates the object that displays the card. */
	private CreateCardDisplay(index: number): void
	{
		let cardChild = new GameObject(`${this.gameObject.gameObjectName}'s CARD - ${index+1}`);
		this.gameObject.game.Instantiate(cardChild);
		this.displayedCards.push(cardChild);

		cardChild.transform.scale = new Vector2(-85, -85);
		cardChild.SetParent(this.gameObject);

		let positionY: number = -160;

		if (this.displayedCards.length < 2)
		{
			cardChild.transform.Translate(new Vector2(0, positionY));
		}
		else
		{
			let position: number = index * 22;
			cardChild.transform.Translate(new Vector2(position, positionY));
		}

		cardChild.AddComponent(new SpriteRendererComponent());
		let layer: number = this.displayedCards.length - 15;
		let renderer = cardChild.GetComponent(SpriteRendererComponent);
		renderer.layer = layer;
		renderer.shadow = true;
		renderer.shadowSize = 10;
	}

	/** Join a seat. Throws an error if the seat already has a player. */
	public JoinSeat(): void
	{
		if (this.house.stage == GameStage.Started) return;

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