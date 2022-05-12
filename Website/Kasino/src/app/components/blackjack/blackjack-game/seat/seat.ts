import { Subject } from "rxjs";
import { ColliderComponent, Color, Game, GameInputFeature, GameObject, MonoBehaviour, NetworkingFeature, Shape, SpriteRendererComponent, TextComponent, Vector2 } from "src/app/game-engine";
import { ShapeRendererComponent } from "src/app/game-engine/utils/rendering/shaperenderer";
import { Bet } from "../bet";
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
	private add1000btnCOL: ColliderComponent;
	private add100btnCOL: ColliderComponent;
	private add50btnCOL: ColliderComponent;
	private clearbtnCOL: ColliderComponent;
	private rebetbtnCOL: ColliderComponent;
	public house: House;
	public seatBet: Bet;
	private displayedCards: CardObject[] = [];

	public Start(): void
	{
		this.collider = this.gameObject.GetComponent(ColliderComponent);
		this.UpdateIsMyTurn(this.myTurn);
		this.resultTextChildComponent.gameObject.isActive = false;
		this.childTextComponent.gameObject.isActive = false;

		this.house.OnStageChange.subscribe((stage) => stage == GameStage.Ended ? this.OnGameEnded() : null);
		this.house.Timer.Elapsed.subscribe(() =>
		{
			if (this.house.CurrentStage != GameStage.Ended) return;
			
			this.resultTextChildComponent.gameObject.isActive = false;
			this.childTextComponent.gameObject.isActive = false;
			this.ClearCards();
		});

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

		this.gameObject.AddComponent(new ShapeRendererComponent(seatShape));
		this.gameObject.AddComponent(new ColliderComponent());

		let buttonShape: Shape = new Shape();
		buttonShape.outline = true;
		buttonShape.outlineWidth = 2;

		let buttonShape1: Shape = new Shape();
		buttonShape1.outline = true;
		buttonShape1.outlineWidth = 2;
		buttonShape1.fillColor = new Color(120, 120, 120);

		let betShape: Shape = new Shape();
		betShape.fillColor = new Color(82, 82, 82);
		betShape.outline = true;
		betShape.outlineWidth = 5;

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
		cardValuesChild.transform.Translate(new Vector2(0, -35));
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

		let betAmount = new GameObject(`${this.gameObject.gameObjectName} - Bet Amount`);
		this.gameObject.game.Instantiate(betAmount);
		betAmount.SetParent(this.gameObject);
		betAmount.AddComponent(new Bet());
		this.seatBet = betAmount.GetComponent(Bet);
		betAmount.transform.scale = new Vector2(100, 30);
		betAmount.transform.Translate(new Vector2(0, -10));
		betAmount.isActive = false;

		let add50btn = new GameObject(`${this.gameObject.gameObjectName}'s Add 50 Button`);
		this.gameObject.game.Instantiate(add50btn);
		let text50 = add50btn.AddComponent(new TextComponent('+50')).GetComponent(TextComponent);
		text50.fontSize = 24;
		add50btn.AddComponent(new ShapeRendererComponent(buttonShape));
		add50btn.transform.scale = new Vector2(100, 50);
		add50btn.SetParent(betAmount);
		add50btn.transform.position = new Vector2(680, 30);
		this.add50btnCOL = add50btn.AddComponent(new ColliderComponent()).GetComponent(ColliderComponent);

		let add100btn = new GameObject(`${this.gameObject.gameObjectName}'s Add 100 Button`);
		this.gameObject.game.Instantiate(add100btn);
		let text100 = add100btn.AddComponent(new TextComponent('+100')).GetComponent(TextComponent);
		text100.fontSize = 24;
		add100btn.AddComponent(new ShapeRendererComponent(buttonShape));
		add100btn.transform.scale = new Vector2(100, 50);
		add100btn.SetParent(betAmount);
		add100btn.transform.position = new Vector2(780, 30);
		this.add100btnCOL = add100btn.AddComponent(new ColliderComponent()).GetComponent(ColliderComponent);

		let add1000btn = new GameObject(`${this.gameObject.gameObjectName}'s Add 1000 Button`);
		this.gameObject.game.Instantiate(add1000btn);
		let text1000 = add1000btn.AddComponent(new TextComponent('+1000')).GetComponent(TextComponent);
		text1000.fontSize = 24;
		add1000btn.AddComponent(new ShapeRendererComponent(buttonShape));
		add1000btn.transform.scale = new Vector2(100, 50);
		add1000btn.SetParent(betAmount);
		add1000btn.transform.position = new Vector2(880, 30);
		this.add1000btnCOL = add1000btn.AddComponent(new ColliderComponent()).GetComponent(ColliderComponent);

		let clearbtn = new GameObject(`${this.gameObject.gameObjectName}'s Clear Button`);
		this.gameObject.game.Instantiate(clearbtn);
		let clearText = clearbtn.AddComponent(new TextComponent('Clear')).GetComponent(TextComponent);
		clearText.fontSize = 24;
		clearbtn.AddComponent(new ShapeRendererComponent(buttonShape1));
		clearbtn.transform.scale = new Vector2(100, 50);
		clearbtn.SetParent(betAmount);
		clearbtn.transform.position = new Vector2(80, 30);
		this.clearbtnCOL = clearbtn.AddComponent(new ColliderComponent()).GetComponent(ColliderComponent);

		let rebetBtn = new GameObject(`${this.gameObject.gameObjectName}'s Rebet Button`);
		this.gameObject.game.Instantiate(rebetBtn);
		let rebetText = rebetBtn.AddComponent(new TextComponent('Rebet')).GetComponent(TextComponent);
		rebetText.fontSize = 24;
		rebetBtn.AddComponent(new ShapeRendererComponent(buttonShape1));
		rebetBtn.transform.scale = new Vector2(100, 50);
		rebetBtn.SetParent(betAmount);
		rebetBtn.transform.position = new Vector2(180, 30);
		this.rebetbtnCOL = rebetBtn.AddComponent(new ColliderComponent()).GetComponent(ColliderComponent);

		let betBackground = new GameObject(`${this.gameObject.gameObjectName} - Bet Background`);
		this.gameObject.game.Instantiate(betBackground);
		betBackground.SetParent(this.gameObject);
		betBackground.AddComponent(new ShapeRendererComponent(betShape)).GetComponent(ShapeRendererComponent).layer = -100;
		betBackground.transform.scale = new Vector2(960, 100);
		betBackground.transform.position = new Vector2(480, 15);

		this.seatBet.buttons.push(add50btn);
		this.seatBet.buttons.push(add100btn);
		this.seatBet.buttons.push(add1000btn);
		this.seatBet.buttons.push(clearbtn);
		this.seatBet.buttons.push(rebetBtn);
		this.seatBet.buttons.push(betBackground);

		this.gameObject.game.GetFeature(GameInputFeature).OnClick.subscribe(event => this.OnClicked(event));
	}

	public Update(deltaTime: number): void
	{

	}

	/** Reset this seats Player. */
	public ResetSeat(): void
	{
		this.Player = null;
	}

	/** Handle on clicked for this seat. */
	private OnClicked(point: Vector2): void
	{
		if (!this.gameObject.isActive) return;

		
		if (this.Occupied)
		{
			if (this.house.client != this.Player)
			{
				return;
			}
			
			if (this.add50btnCOL.Hit(point))
			{
				this.seatBet.AddAmount(50);
			}

			if (this.add100btnCOL.Hit(point))
			{
				this.seatBet.AddAmount(100);
			}

			if (this.add1000btnCOL.Hit(point))
			{
				this.seatBet.AddAmount(1000);
			}

			if (this.clearbtnCOL.Hit(point))
			{
				this.seatBet.ClearBet();
			}

			if (this.rebetbtnCOL.Hit(point))
			{
				this.seatBet.Rebet();
			}
		}

		if (this.collider.Hit(point) && !this.Occupied)
		{
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

		if (this.house.client.data.SeatIndex != this.seatIndex)
		{
			this.standButtonCollider.gameObject.isActive = false;
			this.hitButtonCollider.gameObject.isActive = false;
			return;
		}

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
			this.UpdateIsMyTurn(false);
			this.ClearCards();
			return;
		}

		switch (this.house.CurrentStage)
		{
			//////// OFF /////////////////////////////////////////////////////////////////////////////
			case GameStage.Off:
				this.seatBet.gameObject.isActive = true;
				this.childTextComponent.gameObject.isActive = true;
				this.resultTextChildComponent.gameObject.isActive = false;

				this.seatText.text = this.Player.data.FullName;

				this.ClearCards();
				break;
			////////////////////////////////////////////////////////////////////////////////////////////
			
			//////// STARTED /////////////////////////////////////////////////////////////////////////////
			case GameStage.Started:
				this.seatBet.gameObject.isActive = true;
				this.childTextComponent.gameObject.isActive = true;

				this.childTextComponent.text = this.Player.cardValues.toString();
				this.seatText.text = this.Player.data.FullName;

				this.UpdateIsMyTurn(this.myTurn);
				this.DisplayCard();

				if (this.Player.data.Blackjack == true)
				{
					this.resultTextChildComponent.gameObject.isActive = true;
					this.resultTextChildComponent.text = "BLACKJACK!";
				}
	
				if (!this.Player.data.Busted)
				{
					this.resultTextChildComponent.gameObject.isActive = false;
					break;
				}

				this.resultTextChildComponent.gameObject.isActive = true;
				this.resultTextChildComponent.text = "BUST!";
				break;
			////////////////////////////////////////////////////////////////////////////////////////////
			
			//////// ENDED /////////////////////////////////////////////////////////////////////////////
			case GameStage.Ended:
				if (this.seatBet.lastBet > 0)
				{
					this.resultTextChildComponent.gameObject.isActive = true;
				}
				else
				{
					this.resultTextChildComponent.gameObject.isActive = false;
				}
				this.UpdateIsMyTurn(false);
				this.childTextComponent.text = this.Player.cardValues.toString();

				if (this.Player.data.Blackjack == true)
				{
					this.resultTextChildComponent.text = "BLACKJACK!";
				}
				else if (this.Player.data.Busted == true)
				{
					this.resultTextChildComponent.text = "BUST!";
				}
				else if (this.Player.data.Winner == true)
				{
					this.resultTextChildComponent.text = "WIN!";
				}
				else if(this.Player.data.Winner == false)
				{
					this.resultTextChildComponent.text = "LOSE!";
				}
				break;
			////////////////////////////////////////////////////////////////////////////////////////////
		}
	}

	public OnGameEnded(): void
	{
		if (!this.Player)
		{
			return;
		}

		if (this.seatBet.lastBet > 0)
		{
			this.resultTextChildComponent.gameObject.isActive = true;
		}
		else
		{
			this.resultTextChildComponent.gameObject.isActive = false;
		}

		this.UpdateIsMyTurn(false);
		this.childTextComponent.text = this.Player.cardValues.toString();



		if (this.Player.data.Busted == true)
		{
			this.resultTextChildComponent.text = "BUST!";
		}
		else if (this.Player.data.Winner == true)
		{
			this.resultTextChildComponent.text = "WIN!";
		}
		else if(this.Player.data.Winner == false)
		{
			this.resultTextChildComponent.text = "LOSE!";
		}
	}

	/** Loads a card PNG and displays it. */
	private DisplayCard(): void
	{
		if (!this.Player) return;
		
		for (let i = 0; i < this.Player.data.Cards.length; i++)
		{
			this.displayedCards[ i ].gameObject.isActive = true;
			
			this.displayedCards[ i ].renderer.image = `../../../../../assets/media/blackjack-game/cards/${this.Player.data.Cards[ i ].id}.png`;
			
			this.displayedCards[ i ].ResetPosition();

			this.displayedCards[ i ].transform.Translate(new Vector2(i * 22 - 40, 0));
		}
	}

	/** Resets this seats player's cards */
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
		if (this.house.CurrentStage == GameStage.Started) return;
		if (this.house.client.data.Seated == true) return;

		if (!this.Player)
		{
			this.Player = this.house.client;
			this.Player.data.Seated = true;
			this.Player.data.SeatIndex = this.seatIndex;
			this.OnSeatJoined.next(this.Player.data);
			this.seatBet.gameObject.isActive = true;
			return;
		}
		throw new Error(`Exists Error:\n Seat-Number: ${this.seatIndex}'s Player is not null.`);
	}

	/** Leave a seat. Throws an error if the seat does not contains a player. */
	public LeaveSeat(): void
	{
		if (this.Player)
		{
			this.Player = null;
			this.seatBet.gameObject.isActive = false;
			this.seatText.text = this.gameObject.gameObjectName;
			return;
		}
		throw new Error(`Null Reference Error:\n Seat-Number: ${this.seatIndex}'s Player is null.`);
	}
}