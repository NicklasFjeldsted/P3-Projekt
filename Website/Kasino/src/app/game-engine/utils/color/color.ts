export class Color
{
	public readonly R: number;
	public readonly G: number;
	public readonly B: number;
	public readonly A: number;

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

	// Create the color object.
	constructor(r: number, g: number, b: number, a: number)
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

		this.R = r;
		this.G = g;
		this.B = b;
		this.A = a;
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
}