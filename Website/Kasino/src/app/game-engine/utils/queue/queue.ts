export class Queue<T>
{
	private _items: T[];

	constructor(...params: T[])
	{
		this._items = [ ...params ];
	}

	public Enqueue(item: T): void
	{
		this._items.push(item);
	}

	public Dequeue(): T
	{
		let obj: any = this._items.shift()
		let output: T;

		if (obj === undefined)
		{
			throw new Error(`NullReferenceException: ${this.constructor.name} - Does not contain any items.`);
		}

		output = obj;

		return output;
	}

	public Requeue(): T
	{
		let obj: any = this._items.shift();
		let output: T;

		if (obj === undefined)
		{
			throw new Error(`NullReferenceException: ${this.constructor.name} - Does not contain any items.`);
		}

		output = obj;

		this._items.push(output);
		return output;
	}

	public GetItems(): T[]
	{
		return this._items;
	}

	public GetItemAtIndex(index: number): T
	{
		return this._items[ index ];
	}
}