export class List<T>
{
	private _items: T[];

	constructor(...params: T[])
	{
		this._items = [ ...params ];
	}

	public get Count(): number
	{
		return this._items.length;
	}

	public Add(item: T): void
	{
		this._items.push(item);
	}

	public Remove(item: T): void
	{
		this._items.splice(this._items.indexOf(item), 1);
	}

	public TakeMultiple(amount: number): T[]
	{
		let obj: any[] = this._items.splice(0, amount);
		let output: T[];

		if (obj === undefined)
		{
			throw new Error(`NullReferenceException: ${this.constructor.name} does not contain any items!`);
		}

		output = obj;

		return output;
	}

	public Take(): T
	{
		let obj: any = this._items.pop();
		let output: T;

		if (obj === undefined)
		{
			throw new Error(`NullReferenceException: ${this.constructor.name} does not contain any items!`);
		}

		output = obj;

		return output;
	}

	public GetItems(): T[]
	{
		return this._items;
	}

	public GetItemAtIndex(index: number)
	{
		return this._items[ index ];
	}
}