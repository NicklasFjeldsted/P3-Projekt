import { Color } from "../color";
import { Vector2 } from "../vector2";

export class Sprite
{

}

export interface CustomRadius
{
	/** Top Left Corner. */
	tl: number;
	/** Top Right Corner. */
	tr: number;
	/** Bottom Right Corner. */
	br: number;
	/** Bottom Left Corner. */
	bl: number;
}

export class Shape
{
	radius: number | CustomRadius = 10;
	fill: boolean = true;
	outline: boolean = false;
	fillColor: Color = new Color(50, 205, 50, 1);
	outlineWidth: number = 5;
	outlineColor: Color = new Color(0, 0, 0, 1);
	shadow: boolean = false;
	blur: number = 0;
	shadowColor: Color = new Color(0, 0, 0, 1);
	shadowOffset: Vector2 = Vector2.zero;
}