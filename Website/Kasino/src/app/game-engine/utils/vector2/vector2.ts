import { IDisposable } from "../lifecycle";

export class Vector2 implements IDisposable
{
	constructor(public x: number, public y: number) { }

	Dispose(): void
	{
		
	}
}