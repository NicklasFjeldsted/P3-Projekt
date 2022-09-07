export class Mathf
{
	public static Clamp(num: number, min: number, max: number): number
	{
		return Math.min(Math.max(num, min), max);
	}

	public static Lerp(from: number, to: number, time: number): number
	{
		return from * (1 - time) + to * time;
	}
}