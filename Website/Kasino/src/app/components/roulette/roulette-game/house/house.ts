import { ColliderComponent, Color, GameInputFeature, GameObject, MonoBehaviour, Shape, ShapeRendererComponent, TextComponent, Vector2 } from "src/app/game-engine";
import { IUser, UserData } from "src/app/interfaces/User";
import { Bet } from "../bet";
import { Tile, TileColors } from "../tile";

export class House extends MonoBehaviour
{
	private blackTileShape: Shape = new Shape();
	private redTileShape: Shape = new Shape();
	private grid: GameObject;
	private gridHeight: number = 3;
	private gridWidth: number = 12;
	private tileSize: number = 65;
	public tileColliders: ColliderComponent[] = [];
	private betChild: Bet;
	private bettedDisplay: GameObject;

	public Awake(): void
	{
		this.blackTileShape.radius = 0;
		this.redTileShape.radius = 0;
		this.redTileShape.fillColor = new Color(255, 50, 50);
		this.blackTileShape.fillColor = new Color(50, 50, 50);

		this.grid = new GameObject(`Grid`);
		this.gameObject.game.Instantiate(this.grid);
		this.grid.transform.position = new Vector2(55, 80);

		
		this.bettedDisplay = new GameObject(`Bet Display`);
		this.gameObject.game.Instantiate(this.bettedDisplay);
		this.bettedDisplay.transform.position = new Vector2(100, 300);

		for (let y = this.gridHeight; y > 0; y--)
		{
			for (let x = this.gridWidth; x > 0; x--)
			{
				this.CreateTile(new Vector2(x, y), new Vector2(this.tileSize * x, this.tileSize * y));
			}
		}

		let betTextChild = new GameObject(`Bet Child`);
		this.gameObject.game.Instantiate(betTextChild);
		betTextChild.SetParent(this.gameObject);
		betTextChild.AddComponent(new Bet());
		this.betChild = betTextChild.GetComponent(Bet);

		this.gameObject.game.GetFeature(GameInputFeature).OnClick.subscribe((point) => this.Click(point));
	}

	public Start(): void
	{

	}

	private onDisplays: any[] = [];
	public Update(deltaTime: number): void
	{
		for (const tile of this.tileColliders)
		{
			let _tile = tile.gameObject.GetComponent(Tile);

			if (_tile.data.betAmount > 0)
			{
				_tile.tileDisplay.isActive = true;
				this.onDisplays.push(_tile.tileDisplay);
				_tile.tileDisplay.transform.position = new Vector2(this.onDisplays.length + 65, this.onDisplays.length + 65);
			}
			else
			{
				_tile.tileDisplay.isActive = false;
				this.onDisplays.pop();
			}
		}
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
	}

	private CreateTile(coordinate: Vector2, position: Vector2): void
	{
		let tile = new GameObject(`Grid Tile - X: ${coordinate.x}, Y: ${coordinate.y}`);
		this.gameObject.game.Instantiate(tile);
		tile.SetParent(this.grid);
		
		let shape: Shape = (coordinate.x + coordinate.y) % 2 == 0 ? this.redTileShape : this.blackTileShape;
		let num = ((coordinate.x * 3) - (coordinate.y)) + 1;
		let tileScript = tile.AddComponent(new Tile()).GetComponent(Tile);

		tileScript.bettedDisplay = this.bettedDisplay;
		tileScript.data.color = (coordinate.x + coordinate.y) % 2 == 0 ? TileColors.Red : TileColors.Black;
		tileScript.data.number = num;
		
		tile.transform.scale = new Vector2(this.tileSize, this.tileSize);
		tile.transform.Translate(position);
		
		tile.AddComponent(new ColliderComponent());
		tile.AddComponent(new TextComponent(num.toString()));
		tile.AddComponent(new ShapeRendererComponent(shape));
		
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
}