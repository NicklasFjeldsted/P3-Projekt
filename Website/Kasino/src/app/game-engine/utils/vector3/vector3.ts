import { IDisposable } from "../lifecycle";

export class Vector3 implements IDisposable
{
	constructor(public x: number, public y: number, public z: number) { }

	Dispose(): void
	{
		
	}
}