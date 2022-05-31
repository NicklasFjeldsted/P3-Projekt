import { Color, GameObject, List, MonoBehaviour, GameObjectPool, Queue, RectTransform, Settings, Shape, ShapeRendererComponent, TextComponent, Vector2, Mathf, Transform } from "src/app/game-engine";
import { House } from "../house";
import { Tile, TileColors } from "../tile";

export class Wheel extends MonoBehaviour
{
	public wheelShape: Shape;
	public house: House;
	public shouldSpin: boolean = false;

	public shapeRenderer: ShapeRendererComponent;

	private spinSpeed: number = 0;
	private maxSpinSpeed: number = 35.9;
	private spinSpeedSlowRate: number = 0.008;

	private tileSize: number = 40;
	private wheelTileParent: GameObject;
	private needle: GameObject;

	private tileList: List<GameObject>;

	constructor()
	{
		super();
		this.wheelShape = new Shape();
		this.tileList = new List();
	}

	public Awake(): void
	{
		this.wheelShape.fillColor = new Color(120, 120, 120);
		this.wheelShape.outline = true;
		this.wheelShape.outlineWidth = 2;
		this.wheelShape.radius = 0;

		this.shapeRenderer = this.gameObject.AddComponent(new ShapeRendererComponent(this.wheelShape)).GetComponent(ShapeRendererComponent);

		let needleShape = new Shape();
		needleShape.fillColor = new Color(0, 0, 0);
		needleShape.radius = 0;

		this.wheelTileParent = new GameObject(`Tiles`);
		this.wheelTileParent.SetParent(this.gameObject);
		this.wheelTileParent.transform.scale = this.gameObject.transform.scale;
		this.gameObject.game.Instantiate(this.wheelTileParent);

		let needle = new GameObject(`Wheel Needle`);
		needle.AddComponent(new ShapeRendererComponent(needleShape));
		needle.SetParent(this.gameObject);
		needle.transform.scale = new Vector2(2, this.transform.scale.y);
		this.gameObject.game.Instantiate(needle);
		needle.GetComponent(ShapeRendererComponent).layer = this.shapeRenderer.layer + 5;
		this.needle = needle;
	}

	public Start(): void
	{
		for (let x = 0; x < 37; x++)
		{
			this.CreateTile(new Vector2(x, 0), new Vector2(x * this.tileSize, 35));
		}
	}

	public Update(deltaTime: number): void
	{
		this.spinSpeed = Mathf.Lerp(this.spinSpeed, 0, this.spinSpeedSlowRate);

		if (this.spinSpeed < 0.1)
		{
			this.spinSpeed = 0;
			this.GetTile();
		}

		for (const tile of this.tileList.GetItems())
		{
			if (this.spinSpeed > 0.1)
			{
				tile.transform.position = new Vector2(tile.transform.position.x, 35);
			}
		}

		this.MoveTiles(-this.spinSpeed);
	}

	private GetTile(): void
	{
		let needleRect: RectTransform = this.needle.GetComponent(RectTransform);
		let winningTile: GameObject;
		new Promise<void>((resolve) =>
		{
			for (const tile of this.tileList.GetItems())
			{
				let tileRect: RectTransform = tile.GetComponent(RectTransform);
				if (needleRect.start.x < tileRect.start.x)
				{
					continue;
				}
	
				if (needleRect.end.x > tileRect.end.x)
				{
					continue;
				}
	
				winningTile = tile;
				resolve();
				break;
			}
		}).then(() =>
		{
			winningTile.transform.position = new Vector2(winningTile.transform.position.x, 35);
			let difference: number = this.needle.transform.position.x - winningTile.transform.position.x;
			
			this.MoveTiles(difference);
		});
	}

	public SpinWheel(winningNumber: number): void
	{
		let winningTile: GameObject;
		new Promise<void>((resolve) =>
		{
			for (const tile of this.tileList.GetItems())
			{
				let tileNumber: number = tile.GetComponent(Tile).data.number;

				if (tileNumber != winningNumber)
				{
					continue;
				}

				winningTile = tile;
				resolve();
				break;
			}
		}).then(() =>
		{
			let distance: number = this.needle.transform.position.x - winningTile.transform.position.x;
			this.MoveTiles(distance);
		});
		this.spinSpeed = this.maxSpinSpeed;
	}

	private MoveTiles(moveAmount: number): void
	{
		for (const tile of this.tileList.GetItems())
		{
			tile.transform.Translate(new Vector2(moveAmount, 0));
			if (tile.transform.position.x < 0 - this.tileSize)
			{
				tile.transform.Translate(new Vector2(1440 + this.tileSize, 0));
			}
		}
	}

	private CreateTile(coordinate: Vector2, position: Vector2): void
	{
		if (coordinate.x == 0)
		{
			let tile = new GameObject(`Wheel Tile - X: ${coordinate.x}, Y: ${coordinate.y}`);
			let num = coordinate.x;
			tile.AddComponent(new TextComponent(num.toString()));
			tile.SetParent(this.wheelTileParent);
			
			let tileScript = tile.AddComponent(new Tile()).GetComponent(Tile);
			
			tileScript.data.color = TileColors.Green;
			tileScript.data.number = num;
			
			tile.transform.scale = new Vector2(this.tileSize, this.tileSize);
			tile.transform.position = position;
			
			this.gameObject.game.Instantiate(tile);
			tileScript.shapeRenderer.layer = this.shapeRenderer.layer + 1;
			tileScript.textComponent.fontSize = 16;
	
			this.tileList.Add(tile);
			return;
		}

		let tile = new GameObject(`Wheel Tile - X: ${coordinate.x}, Y: ${coordinate.y}`);
		let num = coordinate.x;
		tile.AddComponent(new TextComponent(num.toString()));
		tile.SetParent(this.wheelTileParent);
		
		let tileScript = tile.AddComponent(new Tile()).GetComponent(Tile);
		
		tileScript.data.color = (coordinate.x + coordinate.y) % 2 == 0 ? TileColors.Black : TileColors.Red;
		tileScript.data.number = num;
		
		tile.transform.scale = new Vector2(this.tileSize, this.tileSize);
		tile.transform.position = position;
		
		this.gameObject.game.Instantiate(tile);
		tileScript.shapeRenderer.layer = this.shapeRenderer.layer + 1;
		tileScript.textComponent.fontSize = 16;

		this.tileList.Add(tile);
	}
}