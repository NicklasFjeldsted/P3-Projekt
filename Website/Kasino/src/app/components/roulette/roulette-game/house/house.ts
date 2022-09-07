import { Button, ColliderComponent, Color, GameObject, Mathf, MonoBehaviour, NetworkingFeature, ServerTimer, Shape, ShapeRendererComponent, TextComponent, Vector2 } from "src/app/game-engine";
import { IUser, UserData } from "src/app/interfaces/User";
import { Bet, Betable } from "../bet";
import { BetData, BetType, Tile, TileColors, TileData } from "../tile";
import { Wheel } from "../wheel";

export class House extends MonoBehaviour
{
	public tileColliders: ColliderComponent[] = [];
	public betables: GameObject[] = [];
	private serverTimerText: TextComponent;
	private differenceText: TextComponent;

	private grid: GameObject;
	private wheel: Wheel;

	private gridHeight: number = 3;
	private gridWidth: number = 12;

	private tileSize: number = 50;
	public betChild: Bet;

	public BetLocked: boolean = false;

	private betButtonShape: Shape;

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

		let betButtonShape = new Shape();

		this.betButtonShape = betButtonShape;

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
		greenTile.transform.Translate(new Vector2(0, 100));
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
		serverTimer.transform.position = new Vector2(150, 350);
		serverTimer.AddComponent(new TextComponent('@TIME'));
		this.serverTimerText = serverTimer.GetComponent(TextComponent);
		this.serverTimerText.shadow = true;
		this.serverTimerText.color = new Color(255, 255, 255);
		this.serverTimerText.blur = 2;
		this.serverTimerText.shadowOffset = new Vector2(2, 2);
		this.gameObject.game.Instantiate(serverTimer);

		let differenceDisplayShape = new Shape();
		differenceDisplayShape.fillColor = new Color(205, 205, 205);

		let differenceDisplay = new GameObject(`Difference Display`);
		differenceDisplay.SetParent(this.gameObject);
		differenceDisplay.transform.scale = new Vector2(200, 100);
		differenceDisplay.transform.position = new Vector2(200, 500);
		differenceDisplay.AddComponent(new ShapeRendererComponent(differenceDisplayShape));
		differenceDisplay.AddComponent(new TextComponent());
		this.differenceText = differenceDisplay.GetComponent(TextComponent);
		this.differenceText.fontSize = 36;
		this.gameObject.game.Instantiate(differenceDisplay);

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

		let row1btnOBJ = new GameObject(`Row 1 Button`);
		row1btnOBJ.AddComponent(new Button(new Vector2(this.tileSize, this.tileSize), `Row 1`, new Vector2(740, 130)));
		row1btnOBJ.AddComponent(new Betable(this, BetType.Row1));
		row1btnOBJ.SetParent(this.gameObject);
		let row1btn = row1btnOBJ.GetComponent(Button);
		row1btn.color = new Color(205, 205, 205);
		row1btn.pressedColor = new Color(105, 105, 105);
		row1btn.ButtonShape.outline = true;
		row1btn.ButtonShape.outlineWidth = 3;
		row1btn.ButtonShape.radius = 2;	
		this.gameObject.game.Instantiate(row1btnOBJ);
		row1btn.ButtonShape.shadow = false;
		this.betables.push(row1btnOBJ);

		let row2btnOBJ = new GameObject(`Row 2 Button`);
		row2btnOBJ.AddComponent(new Button(new Vector2(this.tileSize, this.tileSize), `Row 2`, new Vector2(740, 180)));
		row2btnOBJ.AddComponent(new Betable(this, BetType.Row2));
		row2btnOBJ.SetParent(this.gameObject);
		let row2btn = row2btnOBJ.GetComponent(Button);
		row2btn.color = new Color(205, 205, 205);
		row2btn.pressedColor = new Color(105, 105, 105);
		row2btn.ButtonShape.outline = true;
		row2btn.ButtonShape.outlineWidth = 3;
		row2btn.ButtonShape.radius = 2;
		this.gameObject.game.Instantiate(row2btnOBJ);
		row2btn.ButtonShape.shadow = false;
		this.betables.push(row2btnOBJ);
		
		let row3btnOBJ = new GameObject(`Row 3 Button`);
		row3btnOBJ.AddComponent(new Button(new Vector2(this.tileSize, this.tileSize), `Row 3`, new Vector2(740, 230)));
		row3btnOBJ.AddComponent(new Betable(this, BetType.Row3));
		row3btnOBJ.SetParent(this.gameObject);
		let row3btn = row3btnOBJ.GetComponent(Button);
		row3btn.color = new Color(205, 205, 205);
		row3btn.pressedColor = new Color(105, 105, 105);
		row3btn.ButtonShape.outline = true;
		row3btn.ButtonShape.outlineWidth = 3;
		row3btn.ButtonShape.radius = 2;
		this.gameObject.game.Instantiate(row3btnOBJ);
		row3btn.ButtonShape.shadow = false;
		this.betables.push(row3btnOBJ);

		let column1btnOBJ = new GameObject(`Column 1 Button`);
		column1btnOBJ.AddComponent(new Button(new Vector2(this.tileSize * 4, this.tileSize), `1st 12`, new Vector2(210, 285)));
		column1btnOBJ.AddComponent(new Betable(this, BetType.Column1));
		column1btnOBJ.SetParent(this.gameObject);
		let column1btn = column1btnOBJ.GetComponent(Button);
		column1btn.color = new Color(205, 205, 205);
		column1btn.pressedColor = new Color(105, 105, 105);
		column1btn.ButtonShape.outline = true;
		column1btn.ButtonShape.outlineWidth = 3;
		column1btn.ButtonShape.radius = 2;
		this.gameObject.game.Instantiate(column1btnOBJ);
		column1btn.ButtonShape.shadow = false;
		this.betables.push(column1btnOBJ);
		
		let column2btnOBJ = new GameObject(`Column 2 Button`);
		column2btnOBJ.AddComponent(new Button(new Vector2(this.tileSize * 4, this.tileSize), `2nd 12`, new Vector2(410, 285)));
		column2btnOBJ.AddComponent(new Betable(this, BetType.Column2));
		column2btnOBJ.SetParent(this.gameObject);
		let column2btn = column2btnOBJ.GetComponent(Button);
		column2btn.color = new Color(205, 205, 205);
		column2btn.pressedColor = new Color(105, 105, 105);
		column2btn.ButtonShape.outline = true;
		column2btn.ButtonShape.outlineWidth = 3;
		column2btn.ButtonShape.radius = 2;
		this.gameObject.game.Instantiate(column2btnOBJ);
		column2btn.ButtonShape.shadow = false;
		this.betables.push(column2btnOBJ);
		
		let column3btnOBJ = new GameObject(`Column 3 Button`);
		column3btnOBJ.AddComponent(new Button(new Vector2(this.tileSize * 4, this.tileSize), `3rd 12`, new Vector2(610, 285)));
		column3btnOBJ.AddComponent(new Betable(this, BetType.Column3));
		column3btnOBJ.SetParent(this.gameObject);
		let column3btn = column3btnOBJ.GetComponent(Button);
		column3btn.color = new Color(205, 205, 205);
		column3btn.pressedColor = new Color(105, 105, 105);
		column3btn.ButtonShape.outline = true;
		column3btn.ButtonShape.outlineWidth = 3;
		column3btn.ButtonShape.radius = 2;
		this.gameObject.game.Instantiate(column3btnOBJ);
		column3btn.ButtonShape.shadow = false;
		this.betables.push(column3btnOBJ);
		
		let oddbtnOBJ = new GameObject(`Odds Button`);
		oddbtnOBJ.AddComponent(new Button(new Vector2(65, 65), `Odd`, new Vector2(385, 365)));
		oddbtnOBJ.AddComponent(new Betable(this, BetType.Odd));
		oddbtnOBJ.SetParent(this.gameObject);
		let oddbtn = oddbtnOBJ.GetComponent(Button);
		oddbtn.color = new Color(205, 205, 205);
		oddbtn.pressedColor = new Color(105, 105, 105);
		oddbtn.ButtonShape.outline = true;
		oddbtn.ButtonShape.outlineWidth = 3;
		oddbtn.ButtonShape.radius = 2;
		this.gameObject.game.Instantiate(oddbtnOBJ);
		oddbtn.ButtonShape.shadow = false;
		this.betables.push(oddbtnOBJ);
		
		let evenbtnOBJ = new GameObject(`Even Button`);
		evenbtnOBJ.AddComponent(new Button(new Vector2(65, 65), `Even`, new Vector2(285, 365)));
		evenbtnOBJ.AddComponent(new Betable(this, BetType.Even));
		evenbtnOBJ.SetParent(this.gameObject);
		let evenbtn = evenbtnOBJ.GetComponent(Button);
		evenbtn.color = new Color(205, 205, 205);
		evenbtn.pressedColor = new Color(105, 105, 105);
		evenbtn.ButtonShape.outline = true;
		evenbtn.ButtonShape.outlineWidth = 3;
		evenbtn.ButtonShape.radius = 2;
		this.gameObject.game.Instantiate(evenbtnOBJ);
		evenbtn.ButtonShape.shadow = false;
		this.betables.push(evenbtnOBJ);
		
		let highbtnOBJ = new GameObject(`High Button`);
		highbtnOBJ.AddComponent(new Button(new Vector2(65, 65), `High`, new Vector2(585, 365)));
		highbtnOBJ.AddComponent(new Betable(this, BetType.High));
		highbtnOBJ.SetParent(this.gameObject);
		let highbtn = highbtnOBJ.GetComponent(Button);
		highbtn.color = new Color(205, 205, 205);
		highbtn.pressedColor = new Color(105, 105, 105);
		highbtn.ButtonShape.outline = true;
		highbtn.ButtonShape.outlineWidth = 3;
		highbtn.ButtonShape.radius = 2;
		this.gameObject.game.Instantiate(highbtnOBJ);
		highbtn.ButtonShape.shadow = false;
		this.betables.push(highbtnOBJ);
		
		let lowbtnOBJ = new GameObject(`Low Button`);
		lowbtnOBJ.AddComponent(new Button(new Vector2(65, 65), `Low`, new Vector2(485, 365)));
		lowbtnOBJ.AddComponent(new Betable(this, BetType.Low));
		lowbtnOBJ.SetParent(this.gameObject);
		let lowbtn = lowbtnOBJ.GetComponent(Button);
		lowbtn.color = new Color(205, 205, 205);
		lowbtn.pressedColor = new Color(105, 105, 105);
		lowbtn.ButtonShape.outline = true;
		lowbtn.ButtonShape.outlineWidth = 3;
		lowbtn.ButtonShape.radius = 2;
		this.gameObject.game.Instantiate(lowbtnOBJ);
		lowbtn.ButtonShape.shadow = false;
		this.betables.push(lowbtnOBJ);

		let blackbtnOBJ = new GameObject(`Black Button`);
		blackbtnOBJ.AddComponent(new Button(new Vector2(65, 65), `Black`, new Vector2(685, 365)));
		blackbtnOBJ.AddComponent(new Betable(this, BetType.Black));
		blackbtnOBJ.SetParent(this.gameObject);
		let blackbtn = blackbtnOBJ.GetComponent(Button);
		blackbtn.color = new Color(205, 205, 205);
		blackbtn.pressedColor = new Color(105, 105, 105);
		blackbtn.ButtonShape.outline = true;
		blackbtn.ButtonShape.outlineWidth = 3;
		blackbtn.ButtonShape.radius = 2;
		this.gameObject.game.Instantiate(blackbtnOBJ);
		blackbtn.ButtonShape.shadow = false;
		this.betables.push(blackbtnOBJ);

		let redbtnOBJ = new GameObject(`Red Button`);
		redbtnOBJ.AddComponent(new Button(new Vector2(65, 65), `Red`, new Vector2(785, 365)));
		redbtnOBJ.AddComponent(new Betable(this, BetType.Red));
		redbtnOBJ.SetParent(this.gameObject);
		let redbtn = redbtnOBJ.GetComponent(Button);
		redbtn.color = new Color(205, 205, 205);
		redbtn.pressedColor = new Color(105, 105, 105);
		redbtn.ButtonShape.outline = true;
		redbtn.ButtonShape.outlineWidth = 3;
		redbtn.ButtonShape.radius = 2;
		this.gameObject.game.Instantiate(redbtnOBJ);
		redbtn.ButtonShape.shadow = false;
		this.betables.push(redbtnOBJ);
	}

	public Update(deltaTime: number): void
	{
		if (this.differenceText.text === " " || this.wheel.isSpinning)
		{
			this.differenceText.gameObject.isActive = false;
		}
		else if (!this.wheel.isSpinning)
		{
			this.differenceText.gameObject.isActive = true;
		}
	}

	private Click(point: Vector2): void
	{
		if (this.gameObject.game.balance.balance <= this.betChild.totalBetted) return;
		for (const tile of this.tileColliders)
		{
			if (tile.Hit(point))
			{
				let remaining = Mathf.Clamp(this.betChild.BetIncrement, 0, this.gameObject.game.balance.balance - this.betChild.totalBetted);
				
				if (this.BetLocked)
				{
					return;
				}

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

	public Sync_BetLocked(data: string): void
	{
		let parsedBetLocked = JSON.parse(data);
		this.BetLocked = parsedBetLocked;
	}

	public Show_Result(data: string): void
	{
		let parsedDifference = JSON.parse(data);
		this.differenceText.text = " ";
		if (parsedDifference > 0)
		{
			this.differenceText.text = "+"
			this.differenceText.color = new Color(0, 150, 0);
		}
		else
		{
			this.differenceText.color = new Color(150, 0, 0);
		}

		if (parsedDifference != 0)
		{
			this.differenceText.text += parsedDifference;
		}
	}

	public Clear_Tiles(): void
	{
		this.betChild.ClearBets();
		for (const betable of this.betables)
		{
			betable.GetComponent(Betable).Clear();
		}
	}
}