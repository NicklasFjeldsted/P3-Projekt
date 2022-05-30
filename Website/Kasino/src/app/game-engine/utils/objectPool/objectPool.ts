import { GameObject } from "../gameObject";
import { List } from "../list";

export class GameObjectPool
{
	private m_activePool: List<GameObject>;
	private m_reservePool: List<GameObject>;

	private m_numberActive: number;
	private m_numberReserved: number;

	constructor(reserve: number = 5)
	{
		this.m_activePool = new List();
		this.m_reservePool = new List();

		this.m_numberActive = 0;
		this.m_numberReserved = 0;

		this.InitializeReserve(reserve);
	}

	private InitializeReserve(reserve: number): void
	{
		for (let i = 0; i < reserve; i++)
		{
			const obj: GameObject = new GameObject();
			this.m_reservePool.Add(obj);
			this.m_numberReserved++;
		}
	}

	public Get(): GameObject
	{
		if (this.m_numberReserved == 0)
		{
			this.m_reservePool.Add(new GameObject());
			this.m_numberReserved++;
		}

		const obj: GameObject = this.m_reservePool.Take();
		this.m_numberReserved--;

		this.m_activePool.Add(obj);
		this.m_numberActive++;

		return obj;
	}

	public Return(obj: GameObject): void
	{
		this.m_activePool.Remove(obj);
		this.m_numberActive--;

		this.m_reservePool.Add(obj);
		this.m_numberReserved++;
	}
}