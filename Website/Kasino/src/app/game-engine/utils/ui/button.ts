import { BehaviorSubject, Observable, Subject } from "rxjs";
import { CanvasLayer } from "../canvas";
import { ColliderComponent } from "../collider";
import { Color } from "../color";
import { RectTransform } from "../rectTransform";
import { Rendering } from "../rendering";
import { Shape } from "../sprite";
import { Vector2 } from "../vector2";
import { TextComponent } from "./text";

export class Button extends Rendering
{
	private m_collider: ColliderComponent;
	private m_rectTransform: RectTransform;
	private m_buttonShape: Shape;
	private m_text: TextComponent;
	
	public text: string;
	public isPressed: boolean;
	public layer: number = 2;
	public pressAnimationSpeed: number = 20;

	public color: Color = new Color(50, 205, 50, 1);
	public pressedColor: Color = new Color(25, 103, 25, 1);
	private m_fillColor: Color = this.color;

	private m_MouseDownSubject: Subject<void>;
	public OnMouseDown: Observable<void>;

	constructor(private m_initialScale: Vector2 = new Vector2(100, 100), private m_initialText: string = "Empty Text", private m_initialPosition: Vector2 = new Vector2(0, 0))
	{
		super();
		this.m_MouseDownSubject = new Subject<void>();
		this.OnMouseDown = this.m_MouseDownSubject.asObservable();
		this.m_buttonShape = new Shape();
	}

	private _awoken: boolean = false;

	Awake(): void
	{
		if (this._awoken) return;
		this._awoken = true;

		this.text = this.m_initialText;

		this.m_rectTransform = this.gameObject.AddComponent(new RectTransform(), 1).GetComponent(RectTransform);

		this.RegisterRenderer();

		this.m_collider = this.gameObject.AddComponent(new ColliderComponent()).GetComponent(ColliderComponent);

		this.m_text = this.gameObject.AddComponent(new TextComponent(this.text)).GetComponent(TextComponent);

		this.gameObject.transform.scale = this.m_initialScale;
		this.gameObject.transform.Translate(this.m_initialPosition);

		this.m_buttonShape.shadow = true;
		this.m_buttonShape.blur = 5;
		this.m_buttonShape.shadowOffset = new Vector2(0, 2);

		this.gameObject.game.Input.OnMouseDown.subscribe((point: Vector2) => this.MouseDown(point));
		this.gameObject.game.Input.OnMouseUp.subscribe((point: Vector2) => this.MouseUp(point));
	}

	Start(): void
	{

	}

	Update(deltaTime: number): void
	{
		if (this.isPressed)
		{
			this.m_fillColor = Color.Lerp(this.m_fillColor, this.pressedColor, this.pressAnimationSpeed);
			this.m_buttonShape.fillColor = this.m_fillColor;
		}
		else
		{
			this.m_fillColor = Color.Lerp(this.m_fillColor, this.color, this.pressAnimationSpeed);
			this.m_buttonShape.fillColor = this.m_fillColor;
		}

		this.m_text.text = this.text;

		this.old = this.constructor;
	}

	private MouseDown(point: Vector2): void
	{
		if (!this.m_collider.Hit(point)) return;
		this.isPressed = true;
		this.m_MouseDownSubject.next();
	}

	private MouseUp(point: Vector2): void
	{
		this.isPressed = false;
	}

	Draw(): void
	{
		if (!this.gameObject.isActive)
		{
			return;
		}

		CanvasLayer.GetLayer(this.layer).ExtendedRect(this.m_rectTransform.start, this.m_rectTransform.size, this.m_buttonShape);
	}

	Clear(): void
	{
		let start = new Vector2(
			this.m_rectTransform.start.x - this.m_buttonShape.shadowOffset.x - this.m_buttonShape.blur,
			this.m_rectTransform.start.y - this.m_buttonShape.shadowOffset.y - this.m_buttonShape.blur
		);
		
		let size = new Vector2(
			this.m_rectTransform.size.x + this.m_buttonShape.shadowOffset.x + this.m_buttonShape.blur * 3,
			this.m_rectTransform.size.y + this.m_buttonShape.shadowOffset.y + this.m_buttonShape.blur * 3
		);

		CanvasLayer.GetLayer(this.layer).ClearRect(start, size);
	}
}