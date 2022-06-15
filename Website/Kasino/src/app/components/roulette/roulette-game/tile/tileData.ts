export class TileData
{
	public color: TileColors;
	public number: number = -1;
	public betAmount: number = 0;
}

export enum TileColors
{
	Red,
	Black,
	Green
}

export enum BetType
{
	Straight,
	Row1,
	Row2,
	Row3,
	Column1,
	Column2,
	Column3,
	Odd,
	Even,
	Green,
	Red,
	Black,
	High,
	Low
}

export class BetData
{
	public color: TileColors;
	public number: number = -1;
	public betAmount: number = 0;
	public betType: BetType;

	constructor(tileData: TileData, betType: BetType)
	{
		this.betAmount = tileData.betAmount;
		this.number = tileData.number;
		this.color = tileData.color;
		this.betType = betType;
	}
}