import { Subject } from "rxjs";
import { Balance } from "src/app/interfaces/balance";
import { CanvasLayer } from "../canvas";
import { Color } from "../color";
import { GameObject } from "../gameObject";
import { RectTransform } from "../rectTransform";
import { Rendering } from "../rendering";
import { TextComponent } from "../ui";
import { Vector2 } from "../vector2";

export class InfoBar extends Rendering
{
	public rectTransform: RectTransform;
	private nameObject: GameObject;
	private balanceObject: GameObject;
	public static Balance: Subject<Balance> = new Subject<Balance>();

	Awake(): void
	{
		if (this.gameObject.HasComponent(RectTransform))
		{
			this.rectTransform = this.gameObject.GetComponent(RectTransform);
		}
		else
		{
			this.gameObject.AddComponent(new RectTransform(), 1).GetComponent(RectTransform).Awake();
		}

		this.RegisterRenderer();

		this.gameObject.transform.scale = new Vector2(960, 30);
		this.gameObject.transform.position = new Vector2(480, 590);

		this.nameObject = new GameObject('Name Object');
		this.gameObject.game.Instantiate(this.nameObject);
		this.nameObject.SetParent(this.gameObject);
		this.nameObject.AddComponent(new TextComponent('Name: '));
		this.nameObject.GetComponent(TextComponent).color = new Color(210, 210, 210);
		this.nameObject.transform.scale = new Vector2(100, 30);
		this.nameObject.transform.Translate(new Vector2(-450, 0));

		this.balanceObject = new GameObject('Balance Object');
		this.gameObject.game.Instantiate(this.balanceObject);
		this.balanceObject.SetParent(this.gameObject);
		this.balanceObject.AddComponent(new TextComponent('Balance: '));
		this.balanceObject.GetComponent(TextComponent).color = new Color(210, 210, 210);
		this.balanceObject.transform.scale = new Vector2(100, 30);
		this.balanceObject.transform.Translate(new Vector2(-200, 0));
	}

	public ReceiveBalance(balance: Balance): void
	{
		
	}

	Start(): void
	{

	}

	Update(deltaTime: number): void
	{

	}

	Draw(): void
	{
		CanvasLayer.GetLayer(2).FillRect(this.rectTransform.start, this.rectTransform.size, new Color(25, 25, 25));
	}

	Clear(): void
	{
		CanvasLayer.GetLayer(1).ClearRect(this.rectTransform.start, this.rectTransform.size);
	}
}