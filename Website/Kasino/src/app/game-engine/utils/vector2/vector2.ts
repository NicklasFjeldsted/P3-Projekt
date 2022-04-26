export class Vector2
{
	constructor(public x: number, public y: number) { }
	public static get zero(): Vector2
	{
		return new Vector2(0, 0);
	}
}