import { Color, GameObject, MonoBehaviour, RectTransform, Shape, ShapeRendererComponent, TextComponent, Vector2 } from "src/app/game-engine";
import { House } from "../house";
import { Tile, TileColors } from "../tile";

export class Wheel extends MonoBehaviour
{
	public wheelShape: Shape;
	public house: House;
	public shouldSpin: boolean = true;

	public shapeRenderer: ShapeRendererComponent;

	private tileSize: number = 40;
	private wheelTileParent: GameObject;
	private wheelTiles: Tile[] = [];
	private rectTransform: RectTransform;

	constructor()
	{
		super();
		this.wheelShape = new Shape();
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
		needle.GetComponent(ShapeRendererComponent).layer = this.shapeRenderer.layer + 2;

		for (let x = 0; x < 36; x++)
		{
			this.CreateTile(new Vector2(x, 0), new Vector2(x * this.tileSize, 35));
		}
	}

	public Start(): void
	{
		this.rectTransform = this.gameObject.GetComponent(RectTransform);
	}

	public Update(deltaTime: number): void
	{
		if (this.shouldSpin)
		{
			this.wheelTileParent.transform.Translate(new Vector2(-5, 0));
		}

		for (let i = 0; i < this.wheelTiles.length; i++)
		{
			const tile = this.wheelTiles[ i ];

			if (tile.gameObject.transform.position.x < this.rectTransform.start.x)
			{
				tile.gameObject.transform.position = new Vector2(1400 + this.tileSize, 35);
			}
		}
	}

	private CreateTile(coordinate: Vector2, position: Vector2): void
	{
		let tile = new GameObject(`Wheel Tile - X: ${coordinate.x}, Y: ${coordinate.y}`);
		let num = coordinate.x + 1;
		tile.AddComponent(new TextComponent(num.toString()));
		tile.SetParent(this.wheelTileParent);
		
		let tileScript = tile.AddComponent(new Tile()).GetComponent(Tile);
		
		tileScript.data.color = (coordinate.x + coordinate.y) % 2 == 0 ? TileColors.Red : TileColors.Black;
		tileScript.data.number = num;
		
		tile.transform.scale = new Vector2(this.tileSize, this.tileSize);
		tile.transform.position = position;
		
		this.gameObject.game.Instantiate(tile);
		tileScript.shapeRenderer.layer = this.shapeRenderer.layer + 1;
		tileScript.textComponent.fontSize = 16;

		this.wheelTiles.push(tileScript);
	}
}