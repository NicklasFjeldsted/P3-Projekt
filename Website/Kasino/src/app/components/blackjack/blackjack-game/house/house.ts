import { BehaviorSubject, Observable, Subject } from "rxjs";
import { GameObject, InfoBar, MonoBehaviour, SpriteRendererComponent, TextComponent, Vector2 } from "src/app/game-engine";
import { IUser, User, UserData } from "src/app/interfaces/User";
import { Card, CardObject } from "../cards";
import { Player, PlayerData } from "../player";
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

	public IsPlaying: boolean = false;
	private StageSubject: BehaviorSubject<GameStage>;
	public OnStageChange: Observable<GameStage>;
	public get CurrentStage(): GameStage { return this.StageSubject.value; }
	private SeatTurn: number = -1;
	private displayedCards: CardObject[] = [];

	constructor()
	{
		super();
		this.StageSubject = new BehaviorSubject<GameStage>(GameStage.Off);
		this.OnStageChange = this.StageSubject.asObservable();
	}

	private childText: TextComponent;
	private resultChildText: TextComponent;
	private houseCards: Card[] = [];
	private get HeldValue(): number
	{
		var output = 0;
		for (const card of this.houseCards)
		{
			output += card.value;
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

	Start(): void
	{

	}

	Awake(): void
	{
		this.gameObject.transform.position = new Vector2(480, 300);

		
		let offset: number = 200;
		for (let i = 0; i < 5; i++)
		{
			this.CreateSeat(i+1, new Vector2(i * offset + 80, 525));
		}
		
		for (let i = 0; i < 6; i++)
		{
			this.CreateCardDisplay(i);
		}

		let cardChild = new GameObject('House Cards');
		this.gameObject.game.Instantiate(cardChild);

		let resultChild = new GameObject('House Result Text');
		this.gameObject.game.Instantiate(resultChild);
		resultChild.AddComponent(new TextComponent(' '));
		this.resultChildText = resultChild.GetComponent(TextComponent);
		this.resultChildText.gameObject.transform.Translate(new Vector2(0, -250));

		cardChild.AddComponent(new TextComponent());
		this.childText = cardChild.GetComponent(TextComponent);

		cardChild.SetParent(this.gameObject);
		cardChild.transform.Translate(new Vector2(0, -230));
		cardChild.transform.scale = new Vector2(100, 100);

		this.childText.text = ' ';
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
		this.gameObject.game.Instantiate(cardDisplayGameObject);
		cardDisplayGameObject.SetParent(this.gameObject);
		
		cardDisplayGameObject.AddComponent(new CardObject());
		let cardObject = cardDisplayGameObject.GetComponent(CardObject);
		this.displayedCards.push(cardObject);
		cardObject.transform.Translate(new Vector2(0, -160));
		cardObject.Awake();
		cardObject.renderer.layer = this.displayedCards.length - 15;
	}

	public UpdateSeatData(playerDataString: string)
	{
		// Convert the incoming playerDataJsonString to a Json Object and Index it by the connection id.
		var playerData: PlayerData[] = JSON.parse(playerDataString);

		for (const key in playerData)
		{
			for (const seat of this.seats)
			{
				this.ShouldReset(playerData, seat).then((result) =>
				{
					if (result)
					{
						seat.ResetSeat();
					}
					else if (!result && seat.seatIndex === playerData[ key ].seatIndex)
					{
						seat.UpdateSeat(playerData[ key ]);
					}
				})
				.finally(() =>
				{
					seat.Display();
				});
			}
		}
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

	private async ShouldReset(data: PlayerData[], seat: Seat): Promise<boolean>
	{
		return await new Promise<boolean>((resolve) =>
		{
			for (const key in data)
			{
				if (seat.seatIndex == data[ key ].seatIndex)
				{
					return resolve(false);
				}
			}
			return resolve(true);
		});
	}

	public CreateClient(user: UserData)
	{
		this._client = new Player();
		this.client.data.email = user.email;
		this.client.data.customerID = this.gameObject.game.balance.customerID;
		this.client.data.fullName = user.fullName;
		Player.OnDataChanged.next(this.client.data);
	}

	private CreateSeat(id: number, position: Vector2): GameObject
	{
		let seat: GameObject = new GameObject(`Seat - ${id}`);
		this.gameObject.game.Instantiate(seat);
		seat.SetParent(this.gameObject);
		seat.AddComponent(new Seat());
		seat.GetComponent(Seat).seatIndex = id;
		seat.transform.scale = new Vector2(100, 100);
		seat.transform.position = position;
		this.seats.push(seat.GetComponent(Seat));
		return seat;
	}

	/** This functions checks if the house already holds that card. */
	public IsDuplicate(card: Card): boolean
	{
		for (const hcard of this.houseCards)
		{
			if (card.id === hcard.id)
			{
				return true;
			}
		}
		return false;
	}

	public HouseCards(data: string): void
	{
		let parsedData: any[] = JSON.parse(data);
		this.houseCards = [];
		for (const key in parsedData)
		{
			this.houseCards.push(parsedData[key]);
		}

		this.childText.text = this.HeldValue.toString();

		this.ClearCards();
		this.DisplayCard();

		if (this.CurrentStage == GameStage.Ended)
		{
			this.resultChildText.gameObject.isActive = true;
			
			setTimeout(() =>
			{
				this.childText.gameObject.isActive = false;
				this.resultChildText.gameObject.isActive = false;
				this.ClearCards();
			}, 4500);

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

	public GetBets(): void
	{
		for (const seat of this.seats)
		{
			if (!seat.Occupied) continue;
			seat.seatBet.LockBet();
		}
	}
}