import { BehaviorSubject, Observable } from "rxjs";
import { Color, GameObject, MonoBehaviour, NetworkingFeature, ServerTimer, Shape, ShapeRendererComponent, TextComponent, Vector2 } from "src/app/game-engine";
import { UserData } from "src/app/interfaces/User";
import { Card, CardObject } from "../cards";
import { IPlayerData, Player, BlackjackPlayerData } from "../player";
import { Seat } from "../seat";

export enum GameStage
{
	Off,
	Started,
	Ended
}

export class House extends MonoBehaviour
{
	public seats: Seat[] = [];
	public get OccupiedSeats(): Seat[]
	{
		var output: Seat[] = [];
		for (const seat of this.seats)
		{
			if (!seat.Occupied)
				continue;
			
			output.push(seat);
		}
		return output;
	}

	private StageSubject: BehaviorSubject<GameStage>;
	public OnStageChange: Observable<GameStage>;
	public get CurrentStage(): GameStage { return this.StageSubject.value; }

	public IsPlaying: boolean = false;
	private SeatTurn: number = -1;
	private displayedCards: CardObject[] = [];

	constructor()
	{
		super();
		this.StageSubject = new BehaviorSubject<GameStage>(GameStage.Off);
		this.OnStageChange = this.StageSubject.asObservable();
		this._timer = new ServerTimer();
	}

	private _timer: ServerTimer;
	public get Timer(): ServerTimer
	{
		return this._timer;
	}

	private childText: TextComponent;
	private resultChildText: TextComponent;
	private serverTimerChildText: TextComponent;
	private houseCards: Card[] = [];
	private get HeldValue(): number
	{
		var output = 0;
		for (const card of this.houseCards)
		{
			output += card.value;
		}

		for (const card of this.houseCards)
		{
			if (card.id < 0 || card.id > 5) continue;

			if (output > 11) continue;

			output += 10;
		}
		return output;
	}

	private _client: Player | null = null;
	public get client(): Player
	{
		if (this._client)
		{
			return this._client;
		}
		throw new Error(`${this.gameObject.gameObjectName} > ${this.constructor.name} - player is null!`);
	}

	public Update_PlayerData_Callback(data: string): void
	{
		let playerDataObject = JSON.parse(data);

		let parsedPlayerDataObject: any = {};
		for (const index in playerDataObject)
		{
			parsedPlayerDataObject[ this.FirstCharToLowerCase(index) ] = playerDataObject[index];
		}


		if (parsedPlayerDataObject.customerID == this.client.data.CustomerID)
		{
			this.client.data.Update(parsedPlayerDataObject);
		}
		
		if (parsedPlayerDataObject.seatIndex == null) return;

		for (const seat of this.seats)
		{
			if (seat.seatIndex != parsedPlayerDataObject.seatIndex || !parsedPlayerDataObject.seated) continue;
			
			if (!seat.Player)
			{
				seat.Player = new Player();
			}
			
			seat.Player.data.Update(parsedPlayerDataObject);
			
			seat.Display();
		}
	}

	private FirstCharToLowerCase(string: string): string
	{
		return string.charAt(0).toLocaleLowerCase() + string.slice(1)
	}

	public Get_PlayerData_Callback(data: string): void
	{
		// JSON object indexed with the connection id.
		let playerDataObjects = JSON.parse(data);
		
		for (const key in playerDataObjects)
		{
			let parsedPlayerDataObject: any = {};
			for (const index in playerDataObjects[ key ])
			{
				parsedPlayerDataObject[ this.FirstCharToLowerCase(index) ] = playerDataObjects[key][index];
			}

			if (parsedPlayerDataObject.seatIndex == -1) continue;
			
			for (const seat of this.seats)
			{
				if (seat.seatIndex != parsedPlayerDataObject.seatIndex || !parsedPlayerDataObject.seated) continue;
					
				if (!seat.Player)
				{
					seat.Player = new Player();
				}

				seat.Player.data.Update(parsedPlayerDataObject);

				seat.Display();
			}
		}
	}

	public Update_Server_DueTime(dueTime: string)
	{
		let parsedDueTime = JSON.parse(dueTime);
		this.Timer.Start(parsedDueTime);
	}

	public Player_Connected(data: string): void
	{
		let playerData: BlackjackPlayerData = JSON.parse(data);
		let parsedPlayerData: IPlayerData = BlackjackPlayerData.Parse(playerData);
		console.info(`%c${parsedPlayerData.fullName} %c- %cConnected.`, "color: rgba(0, 183, 255, 1)", "color: rgba(255, 255, 255, 1)", "color: rgba(255, 174, 0, 1)");
	}

	public Player_Disconnected(data: string): void
	{
		let playerData: BlackjackPlayerData = JSON.parse(data);
		let parsedPlayerData: IPlayerData = BlackjackPlayerData.Parse(playerData);
		this.seats.find(seat => seat.seatIndex == parsedPlayerData.seatIndex)?.LeaveSeat();
		console.info(`%c${parsedPlayerData.fullName} %c- %cDisconnected.`, "color: rgba(0, 183, 255, 1)", "color: rgba(255, 255, 255, 1)", "color: rgba(255, 174, 0, 1)");
	}

	Start(): void
	{
		this.Timer.OnServerTimeChanged.subscribe((timeLeft) =>
		{
			if (timeLeft <= 0 || isNaN(timeLeft))
			{
				this.serverTimerChildText.gameObject.isActive = false;
				return;
			}

			this.serverTimerChildText.gameObject.isActive = true;
			
			this.serverTimerChildText.text = `Game Start:\n${(timeLeft / 1000).toFixed(1)}s`;
		});

		this.Timer.Elapsed.subscribe(() =>
		{
			if (this.CurrentStage != GameStage.Ended) return;
			
			this.childText.gameObject.isActive = false;
			this.resultChildText.gameObject.isActive = false;

			this.ClearCards();
		});
	}

	Awake(): void
	{
		this.gameObject.transform.position = new Vector2(480, 300);
		
		let offset: number = 200;
		for (let i = 0; i < 5; i++)
		{
			this.CreateSeat(i+1, new Vector2(i * offset + 80, 515));
		}
		
		for (let i = 0; i < 6; i++)
		{
			this.CreateCardDisplay(i);
		}

		let cardChild = new GameObject('House Cards');
		
		let resultChild = new GameObject('House Result Text');
		resultChild.AddComponent(new TextComponent(' '));
		this.resultChildText = resultChild.GetComponent(TextComponent);
		this.resultChildText.gameObject.transform.Translate(new Vector2(0, -250));
		this.gameObject.game.Instantiate(resultChild);
		
		let shape: Shape = new Shape();
		shape.fillColor = new Color(255, 255, 255);
		shape.outline = true;
		shape.outlineWidth = 4;
		
		cardChild.AddComponent(new TextComponent(' '));
		cardChild.AddComponent(new ShapeRendererComponent(shape))
		this.childText = cardChild.GetComponent(TextComponent);
		this.childText.fontSize = 24;
		cardChild.SetParent(this.gameObject);
		cardChild.transform.Translate(new Vector2(0, -230));
		cardChild.transform.scale = new Vector2(100, 50);
		cardChild.isActive = false;
		this.gameObject.game.Instantiate(cardChild);

		let serverTimerChildText = new GameObject('Server Timer');
		serverTimerChildText.SetParent(this.gameObject);
		serverTimerChildText.AddComponent(new TextComponent(' '));
		serverTimerChildText.transform.scale = new Vector2(400, 100);
		this.serverTimerChildText = serverTimerChildText.GetComponent(TextComponent);
		this.serverTimerChildText.color = new Color(255, 255, 255);
		this.serverTimerChildText.renderLayer = 1000;
		this.serverTimerChildText.fontSize = 36;
		this.serverTimerChildText.fit = true;
		this.serverTimerChildText.shadow = true;
		this.serverTimerChildText.shadowOffset = new Vector2(2, 2);
		this.serverTimerChildText.blur = 10;
		this.gameObject.game.Instantiate(serverTimerChildText);
	}
	
	Update(deltaTime: number): void
	{
		if (this.IsPlaying)
		{
			for (const seat of this.seats)
			{
				seat.UpdateIsMyTurn(false);

				if (this.SeatTurn === seat.seatIndex)
				{
					seat.UpdateIsMyTurn(true);
				}
			}
		}
	}

	public override Dispose(): void
	{
		this.seats.splice(0, this.seats.length);
		this._client = null;
		this.gameObject.RemoveComponent(House);
	}

	public SyncPlaying(data: string): void
	{
		this.IsPlaying = JSON.parse(data);
	}
	
	public SyncTurn(data: string): void
	{
		this.SeatTurn = JSON.parse(data);
	}

	/** Loads a card PNG and displays it. */
	private DisplayCard(): void
	{
		for (let i = 0; i < this.houseCards.length; i++)
		{
			this.displayedCards[ i ].gameObject.isActive = true;
			
			this.displayedCards[ i ].renderer.image = `../../../../../assets/media/blackjack-game/cards/${this.houseCards[ i ].id}.png`;
			
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
		cardDisplayGameObject.SetParent(this.gameObject);
		
		cardDisplayGameObject.AddComponent(new CardObject());
		let cardObject = cardDisplayGameObject.GetComponent(CardObject);
		this.displayedCards.push(cardObject);
		cardObject.transform.Translate(new Vector2(0, -140));
		cardObject.Awake();
		cardObject.renderer.layer = this.displayedCards.length - 15;
		this.gameObject.game.Instantiate(cardDisplayGameObject);
	}

	public GameEnded(): void
	{
		this.SeatTurn = 0;
		this.StageSubject.next(GameStage.Ended);
	}

	public GameStarted(): void
	{
		this.StageSubject.next(GameStage.Started);
	}

	public CreateClient(user: UserData)
	{
		this._client = new Player();
		this.client.data.Email = user.Email;
		this.client.data.CustomerID = this.gameObject.game.balance.customerID;
		this.client.data.FullName = user.FullName;
		this.gameObject.game.GetFeature(NetworkingFeature).Send("Get_PlayerData");
	}

	private CreateSeat(id: number, position: Vector2): GameObject
	{
		let seat: GameObject = new GameObject(`Seat - ${id}`);
		seat.SetParent(this.gameObject);
		seat.AddComponent(new Seat());
		seat.GetComponent(Seat).seatIndex = id;
		seat.GetComponent(Seat).house = this;
		seat.transform.scale = new Vector2(100, 150);
		seat.transform.position = position;
		this.seats.push(seat.GetComponent(Seat));
		this.gameObject.game.Instantiate(seat);
		return seat;
	}

	public HouseCards(data: string): void
	{
		let parsedData: any[] = JSON.parse(data);
		this.houseCards = [];
		for (const key in parsedData)
		{
			this.houseCards.push(parsedData[key]);
		}
		this.childText.gameObject.isActive = true;
		this.childText.text = this.HeldValue.toString();

		this.ClearCards();
		this.DisplayCard();

		if (this.CurrentStage == GameStage.Ended)
		{
			this.resultChildText.gameObject.isActive = true;
			if (this.HeldValue > 21)
			{
				this.resultChildText.text = "HOUSE BUSTED!";
			}
		}
		else if (this.CurrentStage == GameStage.Started)
		{
			this.resultChildText.gameObject.isActive = false;
		}
		else if (this.CurrentStage == GameStage.Off)
		{
			this.resultChildText.gameObject.isActive = false;
			this.childText.gameObject.isActive = false;
		}
	}

	public UpdateSeatBets(data: string): void
	{
		let betObject = JSON.parse(data);
		//console.log("Log: ", data, betObject);
		for (const seat of this.seats)
		{
			if (seat.seatIndex != betObject.seatIndex) continue;
			seat.seatBet.UpdateBet(betObject.amount);
		}
	}
}