import { ColliderComponent, Color, GameInputFeature, GameObject, MonoBehaviour, NetworkingFeature, Shape, ShapeRendererComponent, TextComponent, Vector2 } from "src/app/game-engine";
import { House } from "../house";
import { Tile } from "../tile";

export class Bet extends MonoBehaviour
{
	private betIncrement: number = 0;
	private textComponent: TextComponent;

	private add10btnCOL: ColliderComponent;
	private add50btnCOL: ColliderComponent;
	private add100btnCOL: ColliderComponent;
	private add500btnCOL: ColliderComponent;
	private add1000btnCOL: ColliderComponent;
	private clearBtnCOL: ColliderComponent;

	public get BetIncrement(): number
	{
		return this.betIncrement;
	}

	clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

	public Awake(): void
	{
		let displayShape: Shape = new Shape();
		displayShape.outline = true;
		displayShape.outlineWidth = 4;
		displayShape.radius = 20;
		displayShape.fillColor = new Color(235, 235, 235);

		this.gameObject.AddComponent(new TextComponent('0 kr'));
		this.gameObject.transform.scale = new Vector2(100, 75);
		this.gameObject.transform.position = new Vector2(480, 550);
		this.gameObject.AddComponent(new ShapeRendererComponent(displayShape));
		this.textComponent = this.gameObject.GetComponent(TextComponent);

		let buttonShape: Shape = new Shape();
		buttonShape.outline = true;
		buttonShape.outlineWidth = 2;

		let add10btn = new GameObject(`Add 10 Button`);
		this.gameObject.game.Instantiate(add10btn);
		add10btn.SetParent(this.gameObject);
		add10btn.AddComponent(new ShapeRendererComponent(buttonShape));
		add10btn.AddComponent(new TextComponent('+10'));
		add10btn.AddComponent(new ColliderComponent());
		add10btn.transform.scale = new Vector2(75, 50);
		add10btn.transform.Translate(new Vector2(100, 0));
		this.add10btnCOL = add10btn.GetComponent(ColliderComponent);
		
		let add50btn = new GameObject(`Add 50 Button`);
		this.gameObject.game.Instantiate(add50btn);
		add50btn.SetParent(this.gameObject);
		add50btn.AddComponent(new ShapeRendererComponent(buttonShape));
		add50btn.AddComponent(new TextComponent('+50'));
		add50btn.AddComponent(new ColliderComponent());
		add50btn.transform.scale = new Vector2(75, 50);
		add50btn.transform.Translate(new Vector2(180, 0));
		this.add50btnCOL = add50btn.GetComponent(ColliderComponent);

		let add100btn = new GameObject(`Add 100 Button`);
		this.gameObject.game.Instantiate(add100btn);
		add100btn.SetParent(this.gameObject);
		add100btn.AddComponent(new ShapeRendererComponent(buttonShape));
		add100btn.AddComponent(new TextComponent('+100'));
		add100btn.AddComponent(new ColliderComponent());
		add100btn.transform.scale = new Vector2(75, 50);
		add100btn.transform.Translate(new Vector2(260, 0));
		this.add100btnCOL = add100btn.GetComponent(ColliderComponent);

		let add500btn = new GameObject(`Add 500 Button`);
		this.gameObject.game.Instantiate(add500btn);
		add500btn.SetParent(this.gameObject);
		add500btn.AddComponent(new ShapeRendererComponent(buttonShape));
		add500btn.AddComponent(new TextComponent('+500'));
		add500btn.AddComponent(new ColliderComponent());
		add500btn.transform.scale = new Vector2(75, 50);
		add500btn.transform.Translate(new Vector2(340, 0));
		this.add500btnCOL = add500btn.GetComponent(ColliderComponent);

		let add1000btn = new GameObject(`Add 1000 Button`);
		this.gameObject.game.Instantiate(add1000btn);
		add1000btn.SetParent(this.gameObject);
		add1000btn.AddComponent(new ShapeRendererComponent(buttonShape));
		add1000btn.AddComponent(new TextComponent('+1000'));
		add1000btn.AddComponent(new ColliderComponent());
		add1000btn.transform.scale = new Vector2(75, 50);
		add1000btn.transform.Translate(new Vector2(420, 0));
		this.add1000btnCOL = add1000btn.GetComponent(ColliderComponent);

		let clearBtn = new GameObject(`Clear Button`);
		this.gameObject.game.Instantiate(clearBtn);
		clearBtn.SetParent(this.gameObject);
		clearBtn.AddComponent(new ShapeRendererComponent(buttonShape));
		clearBtn.AddComponent(new TextComponent('Clear'));
		clearBtn.AddComponent(new ColliderComponent());
		clearBtn.transform.scale = new Vector2(75, 50);
		clearBtn.transform.Translate(new Vector2(100, -60));
		this.clearBtnCOL = clearBtn.GetComponent(ColliderComponent);

		this.gameObject.game.GetFeature(GameInputFeature).OnClick.subscribe((point) => this.Click(point));
	}

	public Start(): void
	{

	}

	public Update(deltaTime: number): void
	{
		this.textComponent.text = `${this.betIncrement.toLocaleString('dk', { useGrouping: true })} kr.`;
	}

	private Click(point: Vector2): void
	{
		if (this.clearBtnCOL.Hit(point))
		{
			this.ClearBets();
		}

		if (this.add10btnCOL.Hit(point))
		{
			this.IncreaseBet(10);
		}

		if (this.add50btnCOL.Hit(point))
		{
			this.IncreaseBet(50);
		}

		if (this.add100btnCOL.Hit(point))
		{
			this.IncreaseBet(100);
		}

		if (this.add500btnCOL.Hit(point))
		{
			this.IncreaseBet(500);
		}

		if (this.add1000btnCOL.Hit(point))
		{
			this.IncreaseBet(1000);
		}
	}

	public IncreaseBet(amount: number): void
	{
		this.betIncrement += amount;
		this.betIncrement = this.clamp(this.betIncrement, 0, this.gameObject.game.balance.balance);
		this.betIncrement = this.clamp(this.betIncrement, 0, 2500);
	}

	public Rebet(): void
	{
		
	}

	public ClearBets(): void
	{
		this.Reset();
		for (const tile of this.gameObject.parent.GetComponent(House).tileColliders)
		{
			tile.gameObject.GetComponent(Tile).Clear();
		}
		this.gameObject.game.GetFeature(NetworkingFeature).Send("Clear_Tile_Data");
	}

	public Reset(): void
	{
		this.betIncrement = 0;
	}
}