import { Mathf } from "../mathf";

export class Color
{
	public get R(): number { return this.r; }
	public get G(): number { return this.g; }
	public get B(): number { return this.b; }
	public get A(): number { return this.a; }

	// Create the color object.
	constructor(private r: number, private g: number, private b: number, private a: number = 1)
	{
		if (!Color.IsValidChannel(r))
		{
			throw new Error('Provided incorrect value for Red channel!');
		}

		if (!Color.IsValidChannel(g))
		{
			throw new Error('Provided incorrect value for Green channel!');
		}

		if (!Color.IsValidChannel(b))
		{
			throw new Error('Provided incorrect value for Blue channel!');
		}

		if (!Color.IsValidChannel(a, true))
		{
			throw new Error('Provided incorrect value for Alpha channel!');
		}
	}

	/** Validate that a channel value is acceptable. */
	public static IsValidChannel(value: number, isAlpha = false): boolean
	{
		const max = isAlpha ? 1 : 255;
		if (value < 0 || value > max)
		{
			return false;
		}

		if (!isAlpha && value % 1 !== 0)
		{
			return false;
		}

		return true;
	}


	// Because we are using a canvas to draw objects the color must be a string
	// so we convert our numbers to an rgba style with out values.
	/** Convert this Color object to a CSS friendly 'rgba'. */
	public AsString(): string
	{
		return `rgba(${this.R}, ${this.G}, ${this.B}, ${this.A})`;
	}

	/** Convert an CSS friendly 'rgba' string to a Color object. */
	public static FromString(stringColor: string): Color
	{
		// Removes everything from the string except for colors and comma, then split the string seperated by comma
		const channelValueArray = stringColor.replace(new RegExp(/\(|\)|[A-Za-z]/g), '').split(',');
		
		// Convert the array values to numbers.
		const r = Number(channelValueArray[ 0 ]), g = Number(channelValueArray[ 1 ]), b = Number(channelValueArray[ 2 ]), a = Number(channelValueArray[ 3 ]);
		
		// Check if the values are numbers if not throw an error.
		if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
		{
			throw new Error('Invalid string');
		}

		return new Color(r, g, b, a);
	}

	public static Lerp(from: Color, to: Color, increment: number): Color
	{
		let l_from: Color = new Color(from.r, from.g, from.b, from.a);

		if (l_from.r == to.r && l_from.g == to.g && l_from.b == to.b && l_from.a == to.a) return l_from;

		//#region R
		if (from.r > to.r)
		{
			l_from.r -= increment;
			l_from.r = Mathf.Clamp(l_from.r, to.r, from.r);
		}
		else if (from.r < to.r)
		{
			l_from.r += increment;
			l_from.r = Mathf.Clamp(l_from.r, from.r, to.r);
		}
		//#endregion

		//#region G
		if (from.g > to.g)
		{
			l_from.g -= increment;
			l_from.g = Mathf.Clamp(l_from.g, to.g, from.g);
		}
		else if (from.g < to.g)
		{
			l_from.g += increment;
			l_from.g = Mathf.Clamp(l_from.g, from.g, to.g);
		}
		//#endregion

		//#region B
		if (from.b > to.b)
		{
			l_from.b -= increment;
			l_from.b = Mathf.Clamp(l_from.b, to.b, from.b);
		}
		else if (from.b < to.b)
		{
			l_from.b += increment;
			l_from.b = Mathf.Clamp(l_from.b, from.b, to.b);
		}
		//#endregion

		//#region A
		if (from.a > to.a)
		{
			l_from.a -= increment / (to.a * 255);
			l_from.a = Mathf.Clamp(l_from.a, to.a, from.a);
		}
		else if (from.a < to.a)
		{
			l_from.a += increment / (from.a * 255);
			l_from.a = Mathf.Clamp(l_from.a, from.a, to.a);
		}
		//#endregion

		return l_from;
	}
}