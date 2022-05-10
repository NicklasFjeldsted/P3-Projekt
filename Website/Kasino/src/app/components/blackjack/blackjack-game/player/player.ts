import { Card } from "../cards";
export interface IPlayerData
{
	fullName: string;
	email: string;
	seatIndex: number;
	customerID: number;
	seated: boolean;
	stand: boolean;
	busted: boolean;
	winner: boolean;
	cards: Card[];
}
export class PlayerData
{
	private fullName: string | null;
	private email: string | null;
	private seatIndex: number | null;
	private customerID: number | null;
	private seated: boolean | null;
	private stand: boolean | null;
	private busted: boolean | null;
	private winner: boolean | null;
	private cards: Card[] | null;

	public get FullName(): string { return this.fullName ?? ""; }
	public set FullName(value: string) { this.fullName = value; }

	public get Email(): string { return this.email ?? ""; }
	public set Email(value: string) { this.email = value; }

	public get SeatIndex(): number { return this.seatIndex ?? -1; }
	public set SeatIndex(value: number) { this.seatIndex = value; }

	public get CustomerID(): number { return this.customerID ?? -1; }
	public set CustomerID(value: number) { this.customerID = value; }

	public get Seated(): boolean { return this.seated ?? false; }
	public set Seated(value: boolean) { this.seated = value; }

	public get Stand(): boolean { return this.stand ?? false; }
	public set Stand(value: boolean) { this.stand = value; }

	public get Busted(): boolean { return this.busted ?? false; }
	public set Busted(value: boolean) { this.busted = value; }
	
	public get Winner(): boolean { return this.winner ?? false; }
	public set Winner(value: boolean) { this.winner = value; }

	public get Cards(): Card[] { return this.cards ?? []; }
	public set Cards(value: Card[]) { this.cards = value; }


	constructor(name?: string)
	{
		this.fullName = name ? name : null;
		this.email = null;
		this.seatIndex = null;
		this.customerID = null;
		this.seated = null;
		this.stand = null;
		this.busted = null;
		this.winner = null;
		this.cards = null;
	}

	public Update(newData: PlayerData): void
	{
		for (const prop in this)
		{
			for (const [key, value] of Object.entries(newData))
			{
				if (key != prop) continue;
				
				if (value == null) continue;
	
				this[prop] = value;
			}
		}
	}

	public static Parse(data: any): IPlayerData
	{
		let parsedPlayerDataObject: any = {};
		for (const index in data)
		{
			parsedPlayerDataObject[ this.FirstCharToLowerCase(index) ] = data[index];
		}
		return parsedPlayerDataObject;
	}

	private static FirstCharToLowerCase(string: string): string
	{
		return string.charAt(0).toLocaleLowerCase() + string.slice(1)
	}
}

export class Player
{
	constructor()
	{
		this.data = new PlayerData();
	}
	
	/** The playerdata of this player. */
	public data: PlayerData;

	/** This getter returns the total value of all the cards associated with this player. */
	public get cardValues(): number
	{
		var output: number = 0;
		for (const card of this.data.Cards)
		{
			output += card.value;
		}
		return output;
	}

	/** This function creates a json string from a playerdata object. */
	public static BuildPlayerData(data: PlayerData): string
	{
		return JSON.stringify(
			{
				fullName: data.FullName,
				email: data.Email,
				seatIndex: data.SeatIndex,
				customerID: data.CustomerID,
				seated: data.Seated,
				stand: data.Stand,
				busted: data.Busted,
				winner: data.Winner,
			  	cards: data.Cards
			}
		);
	}
}