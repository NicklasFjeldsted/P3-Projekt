export class Mathf
{
	public static Clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);
}