export abstract class JContainer
{
	public abstract add(value: JValue | JProperty): void;
	public abstract fromObject(content: object): void;
}

export type JValue = JArray | JObject | string | number | null;

export class JProperty
{
	constructor(_name: string, _value: JValue)
	{
		this.name = _name;
		this.value = _value;
	}

	public name!: string;
	public value!: JValue;

	public Value(): object
	{
		let output: { [ key: string ]: JValue; } = {};

		if (this.value instanceof JArray)
		{

		}

		if(this.value instanceof JObject)
		{

		}

		output[ this.name ] = this.value;
		return output;
	}
}

export class JObject extends JContainer
{
	constructor() { super(); }

	private m_properties: JProperty[] = [];
	public get Properties(): JProperty[]
	{
		return this.m_properties;
	}

	public add(value: JProperty): void
	{
		this.m_properties.push(value);
	}

	public fromObject(content: object): JObject
	{
		let output: JObject = new JObject();

		for (const property of Object.entries(content))
		{
			output.add(new JProperty(property[ 0 ], property[ 1 ]))
		}

		return output;
	}

	public Value(): object
	{
		let output: { [ key: string ]: any; } = {};
		for (const prop of this.Properties)
		{
			output[ prop.name ] = prop.Value();
		}
		return output;
	}
}

export class JArray extends JContainer
{
	constructor() { super(); }

	private m_items: JValue[] = [];
	public get Items(): JValue[]
	{
		return this.m_items;
	}

	public add(value: JValue): void
	{
		this.m_items.push(value);
	}

	public fromObject(content: object): void
	{
		throw new Error("Method not implemented.");
	}
}
