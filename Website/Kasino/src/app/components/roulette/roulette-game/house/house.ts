import { ColliderComponent, GameInputFeature, GameObject, MonoBehaviour, ServerTimer, Shape, TextComponent, Vector2 } from "src/app/game-engine";
import { IUser, UserData } from "src/app/interfaces/User";
import { Bet } from "../bet";
import { Tile, TileColors } from "../tile";

export class House extends MonoBehaviour
{
	public tileColliders: ColliderComponent[] = [];
	private serverTimerText: TextComponent;

	private blackTileShape: Shape = new Shape();
	private redTileShape: Shape = new Shape();

	private grid: GameObject;

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
		// this.blackTileShape.radius = 0;
		// this.redTileShape.radius = 0;
		// this.redTileShape.fillColor = new Color(255, 50, 50);
		// this.blackTileShape.fillColor = new Color(50, 50, 50);

		this.grid = new GameObject(`Grid`);
		this.gameObject.game.Instantiate(this.grid);
		this.grid.transform.position = new Vector2(55, 80);

		for (let y = this.gridHeight; y > 0; y--)
		{
			for (let x = this.gridWidth; x > 0; x--)
			{
				this.CreateTile(new Vector2(x, y), new Vector2(this.tileSize * x, this.tileSize * y));
			}
		}

		// let greenTileShape: Shape = new Shape();
		// greenTileShape.radius = 0;

		let greenTile = new GameObject(`Green Grid Tile`);
		this.gameObject.game.Instantiate(greenTile);
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

		let betTextChild = new GameObject(`Bet Child`);
		this.gameObject.game.Instantiate(betTextChild);
		betTextChild.SetParent(this.gameObject);
		betTextChild.AddComponent(new Bet());
		this.betChild = betTextChild.GetComponent(Bet);

		let serverTimer = new GameObject(`Roulette Server Timer`);
		this.gameObject.game.Instantiate(serverTimer);
		serverTimer.transform.scale = new Vector2(100, 100);
		serverTimer.transform.position = new Vector2(480, 300);
		serverTimer.SetParent(this.gameObject);
		serverTimer.AddComponent(new TextComponent('@TIME'));
		this.serverTimerText = serverTimer.GetComponent(TextComponent);

		this.gameObject.game.GetFeature(GameInputFeature).OnClick.subscribe((point) => this.Click(point));
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
		for (const tile of this.tileColliders)
		{
			if (tile.Hit(point))
			{
				tile.gameObject.GetComponent(Tile).AddAmount(this.betChild.BetIncrement);
			}
		}
		this.betChild.Reset();
	}

	private CreateTile(coordinate: Vector2, position: Vector2): void
	{
		let tile = new GameObject(`Grid Tile - X: ${coordinate.x}, Y: ${coordinate.y}`);
		this.gameObject.game.Instantiate(tile);
		tile.SetParent(this.grid);
		
		let shape: Shape = (coordinate.x + coordinate.y) % 2 == 0 ? this.redTileShape : this.blackTileShape;
		let num = ((coordinate.x * 3) - (coordinate.y)) + 1;
		let tileScript = tile.AddComponent(new Tile()).GetComponent(Tile);

		tileScript.data.color = (coordinate.x + coordinate.y) % 2 == 0 ? TileColors.Red : TileColors.Black;
		tileScript.data.number = num;
		
		tile.transform.scale = new Vector2(this.tileSize, this.tileSize);
		tile.transform.Translate(position);
		
		tile.AddComponent(new ColliderComponent());
		tile.AddComponent(new TextComponent(num.toString()));
		
		this.tileColliders.push(tile.GetComponent(ColliderComponent));
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
}