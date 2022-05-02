import { Subject } from "rxjs";
import { ColliderComponent, Color, GameInputFeature, GameObject, MonoBehaviour, NetworkingFeature, Shape, SpriteRendererComponent, TextComponent, Vector2 } from "src/app/game-engine";
import { ShapeRendererComponent } from "src/app/game-engine/utils/rendering/shaperenderer";
import { Card, CardObject } from "../cards";
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
	private displayedCards: CardObject[] = [];

	public Start(): void
	{
		this.collider = this.gameObject.GetComponent(ColliderComponent);
		this.house = this.gameObject.parent.GetComponent(House);
		this.UpdateIsMyTurn(this.myTurn);
		this.resultTextChildComponent.gameObject.isActive = false;
		this.childTextComponent.gameObject.isActive = false;
	}

	public Awake(): void
	{
		for (let i = 0; i < 6; i++)
		{
			this.CreateCardDisplay(i);
		}

		let seatShape: Shape = new Shape();
		seatShape.fillColor = new Color(255, 255, 255);
		seatShape.radius = 20;
		seatShape.outline = true;
		seatShape.outlineWidth = 2;

		this.gameObject.AddComponent(new ShapeRendererComponent(seatShape));
		this.gameObject.AddComponent(new ColliderComponent());

		let buttonShape: Shape = new Shape();
		buttonShape.outline = true;
		buttonShape.outlineWidth = 2;

		let nameShape: Shape = new Shape();
		nameShape.outline = true;
		nameShape.outlineWidth = 2;

		let seatText = new GameObject(`${this.gameObject.gameObjectName}'s Text`);
		this.gameObject.game.Instantiate(seatText);
		seatText.SetParent(this.gameObject);
		seatText.AddComponent(new TextComponent(this.gameObject.gameObjectName));
		let seatTextShape = seatText.AddComponent(new ShapeRendererComponent(nameShape)).GetComponent(ShapeRendererComponent);
		this.seatText = seatText.GetComponent(TextComponent);
		this.seatText.fit = true;
		seatTextShape.layer = 2;
		seatText.transform.Translate(new Vector2(0, 25));
		seatText.transform.scale = new Vector2(110, 30);

		let cardValuesChild = new GameObject(`${this.gameObject.gameObjectName}'s "Card Values Child"`);
		this.gameObject.game.Instantiate(cardValuesChild);
		cardValuesChild.SetParent(this.gameObject);
		cardValuesChild.transform.Translate(new Vector2(0, -25));
		cardValuesChild.transform.scale = new Vector2(50, 30);
		cardValuesChild.AddComponent(new TextComponent());
		this.childTextComponent = cardValuesChild.GetComponent(TextComponent);
		this.childTextComponent.fit = true;
		this.childTextComponent.fontSize = 24;

		let buttons = new GameObject(`${this.gameObject.gameObjectName}'s buttons`);
		this.gameObject.game.Instantiate(buttons);
		buttons.SetParent(this.gameObject);
		buttons.transform.scale = new Vector2(100, 30);
		buttons.transform.Translate(new Vector2(0, -65));
		
		let hitButton = new GameObject(`${buttons.gameObjectName}'s Hit Button`);
		this.gameObject.game.Instantiate(hitButton);
		hitButton.SetParent(buttons);
		hitButton.transform.scale = new Vector2(80, 30);
		hitButton.transform.Translate(new Vector2(-40, 0));
		hitButton.AddComponent(new TextComponent("Hit"));
		hitButton.AddComponent(new ColliderComponent());
		this.hitButtonCollider = hitButton.GetComponent(ColliderComponent);
		hitButton.AddComponent(new ShapeRendererComponent(buttonShape));
		
		let standButton = new GameObject(`${buttons.gameObjectName}'s Stand Button`);
		this.gameObject.game.Instantiate(standButton);
		standButton.SetParent(buttons);
		standButton.transform.scale = new Vector2(80, 30);
		standButton.transform.Translate(new Vector2(40, 0));
		standButton.AddComponent(new TextComponent("Stand"));
		standButton.AddComponent(new ColliderComponent());
		this.standButtonCollider = standButton.GetComponent(ColliderComponent);
		standButton.AddComponent(new ShapeRendererComponent(buttonShape));

		let resultTextChild = new GameObject(`${this.gameObject.gameObjectName}'s Result Child`);
		this.gameObject.game.Instantiate(resultTextChild);
		resultTextChild.SetParent(this.gameObject);
		resultTextChild.transform.scale = new Vector2(100, 30);
		resultTextChild.transform.Translate(new Vector2(0, -90));
		resultTextChild.AddComponent(new TextComponent('@result'));
		this.resultTextChildComponent = resultTextChild.GetComponent(TextComponent);
		this.resultTextChildComponent.renderLayer = -1;

		this.gameObject.game.GetFeature(GameInputFeature).OnClick.subscribe(event => this.OnClicked(event));
	}

	public Update(deltaTime: number): void
	{

	}

	/** Update this seats player's data with new data. */
	public UpdateSeat(data: PlayerData): void
	{
		if (!this.Player)
		{
			this.Player = new Player();
		}

		this.Player.UpdateData(data);
	}

	/** Reset this seats Player. */
	public ResetSeat(): void
	{
		this.Player = null;
	}

	/** Handle on clicked for this seat. */
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
		if (!this.Player)
		{
			this.childTextComponent.gameObject.isActive = false;
			this.resultTextChildComponent.gameObject.isActive = false;
			this.seatText.text = this.gameObject.gameObjectName;
			this.ClearCards();
			return;
		}

		this.UpdateIsMyTurn(this.myTurn);
		
		if (this.house.stage == GameStage.Ended)
		{
			this.resultTextChildComponent.gameObject.isActive = true;
			this.childTextComponent.text = this.Player.cardValues.toString();
			this.DisplayCard();
			setTimeout(() => this.ClearCards(), 4000);
			if (this.Player.data.busted == true)
			{
				this.resultTextChildComponent.text = "BUST!";
			}
			else if (this.Player.data.winner == true)
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
			this.childTextComponent.gameObject.isActive = true;
			this.childTextComponent.text = this.Player.cardValues.toString();
			this.seatText.text = this.Player.data.fullName;
			this.DisplayCard();

			if (!this.Player.data.busted)
			{
				this.resultTextChildComponent.gameObject.isActive = false;
				return;
			}

			this.resultTextChildComponent.gameObject.isActive = true;
			this.resultTextChildComponent.text = "BUST!";
		}
		else if (this.house.stage == GameStage.Off)
		{
			this.childTextComponent.gameObject.isActive = true;
			this.resultTextChildComponent.gameObject.isActive = false;
			this.seatText.text = this.Player.data.fullName;
			this.ClearCards();
		}
	}

	/** Check if the card with the cardID parameter is already displayed on this seat. */
	private IsCardDisplayed(cardID: number): boolean
	{
		for (let displayCard of this.displayedCards)
		{
			if (displayCard.renderer.image == null) continue;

			if (!displayCard.renderer.image.includes(`${cardID}`)) continue;

			return true;
		}

		return false;
	}

	/** Loads a card PNG and displays it. */
	private DisplayCard(): void
	{
		if (!this.Player) return;
		
		for (let i = 0; i < this.Player.data.cards.length; i++)
		{
			this.displayedCards[ i ].gameObject.isActive = true;
			
			this.displayedCards[ i ].renderer.image = `../../../../../assets/media/blackjack-game/cards/${this.Player.data.cards[ i ].id}.png`;
			
			this.displayedCards[ i ].ResetPosition();

			this.displayedCards[ i ].transform.Translate(new Vector2(i * 22 - 40, 0));
		}
	}

	private ClearCards(): void
	{
		for (let displayCard of this.displayedCards)
		{
			displayCard.renderer.image = null;
		}
	}

	/** Creates the object that displays the card. */
	private CreateCardDisplay(index: number): void
	{
		let cardDisplayGameObject = new GameObject(`${this.gameObject.gameObjectName}'s CARD OBJECT - ${index}`);
		this.gameObject.game.Instantiate(cardDisplayGameObject);
		cardDisplayGameObject.SetParent(this.gameObject);
		
		cardDisplayGameObject.AddComponent(new CardObject());
		let cardObject = cardDisplayGameObject.GetComponent(CardObject);
		this.displayedCards.push(cardObject);
		cardObject.transform.Translate(new Vector2(0, -160));
		cardObject.Awake();
		cardObject.renderer.layer = this.displayedCards.length - 15;
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