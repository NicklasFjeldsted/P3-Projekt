import { ColliderComponent, Color, GameInputFeature, GameObject, Mathf, MonoBehaviour, ServerTimer, Shape, TextComponent, Vector2 } from "src/app/game-engine";
import { IUser, UserData } from "src/app/interfaces/User";
import { Bet } from "../bet";
import { Tile, TileColors } from "../tile";
import { Wheel } from "../wheel";

export class House extends MonoBehaviour
{
	public tileColliders: ColliderComponent[] = [];
	private serverTimerText: TextComponent;

	private grid: GameObject;
	private wheel: Wheel;

	private gridHeight: number = 3;
	private gridWidth: number = 12;

	private tileSize: number = 65;
	private betChild: Bet;

	private _timer: ServerTimer;
	public get Timer(): ServerTimer
	{
		return this._timer;
	}

	constructor()
	{
		super();
		this._timer = new ServerTimer();
	}

	public Awake(): void
	{
		this.grid = new GameObject(`Grid`);
		this.grid.transform.position = new Vector2(85, 80);
		this.gameObject.game.Instantiate(this.grid);

		let wheel = new GameObject(`Wheel`);
		wheel.AddComponent(new Wheel());
		wheel.transform.position = new Vector2(480, 35);
		wheel.transform.scale = new Vector2(960, 75);
		this.wheel = wheel.GetComponent(Wheel);
		this.wheel.house = this;
		this.gameObject.game.Instantiate(wheel);

		for (let y = this.gridHeight; y > 0; y--)
		{
			for (let x = this.gridWidth; x > 0; x--)
			{
				this.CreateTile(new Vector2(x, y), new Vector2(this.tileSize * x, this.tileSize * y));
			}
		}

		let greenTile = new GameObject(`Green Grid Tile`);
		greenTile.SetParent(this.grid);
		greenTile.AddComponent(new TextComponent('0'));
		greenTile.AddComponent(new Tile());
		greenTile.AddComponent(new ColliderComponent());
		let greenTileScript = greenTile.GetComponent(Tile);
		greenTileScript.data.number = 0;
		greenTileScript.data.color = TileColors.Green;
		greenTile.transform.scale = new Vector2(this.tileSize, this.tileSize);
		greenTile.transform.Translate(new Vector2(0, 130));
		this.tileColliders.push(greenTile.GetComponent(ColliderComponent));
		this.gameObject.game.Instantiate(greenTile);

		let betTextChild = new GameObject(`Bet Child`);
		betTextChild.SetParent(this.gameObject);
		betTextChild.AddComponent(new Bet());
		this.betChild = betTextChild.GetComponent(Bet);
		this.gameObject.game.Instantiate(betTextChild);

		let serverTimer = new GameObject(`Roulette Server Timer`);
		serverTimer.SetParent(this.gameObject);
		serverTimer.transform.scale = new Vector2(300, 30);
		serverTimer.transform.position = new Vector2(480, 350);
		serverTimer.AddComponent(new TextComponent('@TIME'));
		this.serverTimerText = serverTimer.GetComponent(TextComponent);
		this.serverTimerText.shadow = true;
		this.serverTimerText.color = new Color(255, 255, 255);
		this.serverTimerText.blur = 2;
		this.serverTimerText.shadowOffset = new Vector2(2, 2);
		this.gameObject.game.Instantiate(serverTimer);

		this.gameObject.game.Input.OnMouseUp.subscribe((point) => this.Click(point));
	}

	public Start(): void
	{
		this.Timer.OnServerTimeChanged.subscribe((time) =>
		{
			if (time <= 0 || isNaN(time))
			{
				this.serverTimerText.gameObject.isActive = false;
				return;
			}

			this.serverTimerText.gameObject.isActive = true;

			this.serverTimerText.text = `Round Start:\n${(time / 1000).toFixed(1)}s`;
		});
	}

	public Update(deltaTime: number): void
	{
		
	}

	private Click(point: Vector2): void
	{
		if (this.gameObject.game.balance.balance <= this.betChild.totalBetted) return;
		for (const tile of this.tileColliders)
		{
			if (tile.Hit(point))
			{
				let remaining = Mathf.Clamp(this.betChild.BetIncrement, 0, this.gameObject.game.balance.balance - this.betChild.totalBetted);
				
				tile.gameObject.GetComponent(Tile).AddAmount(remaining);
				
				this.betChild.totalBetted += remaining;
			}
		}
	}

	private CreateTile(coordinate: Vector2, position: Vector2): void
	{
		let tile = new GameObject(`Grid Tile - X: ${coordinate.x}, Y: ${coordinate.y}`);
		tile.SetParent(this.grid);
		
		let num = ((coordinate.x * 3) - (coordinate.y)) + 1;
		let tileScript = tile.AddComponent(new Tile()).GetComponent(Tile);
		
		tileScript.data.color = (coordinate.x + coordinate.y) % 2 == 0 ? TileColors.Red : TileColors.Black;
		tileScript.data.number = num;
		
		tile.transform.scale = new Vector2(this.tileSize, this.tileSize);
		tile.transform.Translate(position);
		
		tile.AddComponent(new ColliderComponent());
		tile.AddComponent(new TextComponent(num.toString()));
		
		this.tileColliders.push(tile.GetComponent(ColliderComponent));
		this.gameObject.game.Instantiate(tile);
	}

	public Player_Connected(data: string): void
	{
		let userData: UserData = JSON.parse(data);
		let parsedUserData: IUser = UserData.Parse(userData);
		console.info(`%c${parsedUserData.fullName} %c- %cConnected.`, "color: rgba(0, 183, 255, 1)", "color: rgba(255, 255, 255, 1)", "color: rgba(255, 174, 0, 1)");
	}

	public Player_Disconnected(data: string): void
	{
		let userData: UserData = JSON.parse(data);
		let parsedUserData: IUser = UserData.Parse(userData);
		console.info(`%c${parsedUserData.fullName} %c- %cDisconnected.`, "color: rgba(0, 183, 255, 1)", "color: rgba(255, 255, 255, 1)", "color: rgba(255, 174, 0, 1)");
	}

	public Update_Server_DueTime(data: string): void
	{
		let parsedDueTime = JSON.parse(data);
		this.Timer.Start(parsedDueTime);
	}

	public Wheel_Spin(data: string): void
	{
		let parsedWinningNumber = JSON.parse(data);
		this.wheel.SpinWheel(parsedWinningNumber);
		console.log(parsedWinningNumber);
	}
}