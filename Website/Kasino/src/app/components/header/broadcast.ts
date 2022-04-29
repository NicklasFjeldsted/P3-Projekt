import { Subject } from "rxjs";

export class Broadcast
{
	private static _instance: Broadcast;
	public static get Instance(): Broadcast
	{
		if(!Broadcast._instance)
		{
			return Broadcast._instance = new Broadcast();
		}

		return Broadcast._instance;
	}
	public onBalanceChange: Subject<number> = new Subject<number>();
}