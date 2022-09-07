import { Button, Color, GameObject, Mathf, MonoBehaviour, NetworkingFeature, Shape, ShapeRendererComponent, TextComponent, Vector2 } from "src/app/game-engine";
import { House } from "../house";
import { Tile } from "../tile";
import { Betable } from "./betable";

export class Bet extends MonoBehaviour
{
	private m_betIncrement: number = 0;
	private m_textComponent: TextComponent;
	public totalBetted: number = 0;

	private m_10: Button;
	private m_50: Button;
	private m_100: Button;
	private m_500: Button;
	private m_1000: Button;
	private m_clear: Button;
	private m_reset: Button;

	public get BetIncrement(): number
	{
		return this.m_betIncrement;
	}

	public Awake(): void
	{
		let displayShape: Shape = new Shape();
		displayShape.outline = true;
		displayShape.outlineWidth = 4;
		displayShape.radius = 20;
		displayShape.fillColor = new Color(235, 235, 235);

		this.gameObject.AddComponent(new TextComponent(' '));
		this.gameObject.transform.scale = new Vector2(100, 75);
		this.gameObject.transform.position = new Vector2(480, 550);
		this.gameObject.AddComponent(new ShapeRendererComponent(displayShape));
		this.m_textComponent = this.gameObject.GetComponent(TextComponent);

		let buttonShape: Shape = new Shape();
		buttonShape.outline = true;
		buttonShape.outlineWidth = 2;

		let add10Obj = new GameObject(`Add 10 Button`);
		add10Obj.SetParent(this.gameObject);
		this.m_10 = add10Obj.AddComponent(new Button(new Vector2(75, 50), "+10", new Vector2(100, 0))).GetComponent(Button);
		this.gameObject.game.Instantiate(add10Obj);
		
		let add50Obj = new GameObject(`Add 50 Button`);
		add50Obj.SetParent(this.gameObject);
		this.m_50 = add50Obj.AddComponent(new Button(new Vector2(75, 50), "+50", new Vector2(180, 0))).GetComponent(Button);
		this.gameObject.game.Instantiate(add50Obj);

		let add100Obj = new GameObject(`Add 100 Button`);
		add100Obj.SetParent(this.gameObject);
		this.m_100 = add100Obj.AddComponent(new Button(new Vector2(75, 50), "+100", new Vector2(260, 0))).GetComponent(Button);
		this.gameObject.game.Instantiate(add100Obj);

		let add500Obj = new GameObject(`Add 500 Button`);
		add500Obj.SetParent(this.gameObject);
		this.m_500 = add500Obj.AddComponent(new Button(new Vector2(75, 50), "+500", new Vector2(340, 0))).GetComponent(Button);
		this.gameObject.game.Instantiate(add500Obj);

		let add1000Obj = new GameObject(`Add 1000 Button`);
		add1000Obj.SetParent(this.gameObject);
		this.m_1000 = add1000Obj.AddComponent(new Button(new Vector2(75, 50), "+1000", new Vector2(420, 0))).GetComponent(Button);
		this.gameObject.game.Instantiate(add1000Obj);

		let resetObj = new GameObject(`Reset Button`);
		resetObj.SetParent(this.gameObject);
		this.m_reset = resetObj.AddComponent(new Button(new Vector2(75, 50), "Reset", new Vector2(180, -60))).GetComponent(Button);
		this.gameObject.game.Instantiate(resetObj);

		let clearObj = new GameObject(`Clear Button`);
		clearObj.SetParent(this.gameObject);
		this.m_clear = clearObj.AddComponent(new Button(new Vector2(75, 50), "Clear", new Vector2(100, -60))).GetComponent(Button);
		this.gameObject.game.Instantiate(clearObj);
	}

	public Start(): void
	{
		this.m_10.OnMouseDown.subscribe(() => this.IncreaseBet(10));
		this.m_50.OnMouseDown.subscribe(() => this.IncreaseBet(50));
		this.m_100.OnMouseDown.subscribe(() => this.IncreaseBet(100));
		this.m_500.OnMouseDown.subscribe(() => this.IncreaseBet(500));
		this.m_1000.OnMouseDown.subscribe(() => this.IncreaseBet(1000));

		this.m_clear.OnMouseDown.subscribe(() => this.ClearBets());
		this.m_reset.OnMouseDown.subscribe(() => this.Reset());
	}

	public Update(deltaTime: number): void
	{
		this.m_textComponent.text = `${this.m_betIncrement} kr.`;
	}

	public IncreaseBet(amount: number): void
	{
		this.m_betIncrement += amount;
		this.m_betIncrement = Mathf.Clamp(this.m_betIncrement, 0, this.gameObject.game.balance.balance);
		this.m_betIncrement = Mathf.Clamp(this.m_betIncrement, 0, 2500);
	}

	public Rebet(): void
	{
		
	}

	public ClearBets(): void
	{
		this.totalBetted = 0;
		for (const tile of this.gameObject.parent.GetComponent(House).tileColliders)
		{
			tile.gameObject.GetComponent(Tile).Clear();
		}
		for (const betable of this.gameObject.parent.GetComponent(House).betables)
		{
			betable.GetComponent(Betable).Clear();
		}
		this.gameObject.game.GetFeature(NetworkingFeature).Send("Clear_Bet_Data");
	}

	public Reset(): void
	{
		this.m_betIncrement = 0;
	}
}