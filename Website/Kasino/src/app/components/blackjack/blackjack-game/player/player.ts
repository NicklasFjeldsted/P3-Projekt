import { Card } from "../cards";
export interface IPlayerData
{
	fullName: string;
	seatIndex: number;
	seated: boolean;
	stand: boolean;
	busted: boolean;
	cards: Card[];
}

export class PlayerData implements IPlayerData
{
	public fullName: string;
	public seatIndex: number;
	public seated: boolean;
	public stand: boolean;
	public busted: boolean;
	public cards: Card[];

	constructor(name?: string)
	{
		this.fullName = name ? name : "No Name";
		this.seatIndex = -1;
		this.seated = false;
		this.stand = false;
		this.busted = false;
		this.cards = [];
	}
}

export class Player
{
	private static _instance: Player;
	public static get Instance(): Player
	{
		if (!Player._instance)
		{
			Player._instance = new Player();
		}

		return Player._instance;
	}

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
		for (const card of this.data.cards)
		{
			output += card.value;
		}
		return output;
	}

	/** This functions updates the card of this player. */
	private UpdateCards(cards: Card[]): void
	{
		for (const card of cards)
		{
			if (this.IsDuplicate(card))
			{
				continue;
			}

			this.data.cards.push(card);
		}
	}

	/** This function updates all of this players data. */
	public UpdateData(newData: PlayerData): void
	{
		this.data.fullName = newData.fullName;
		this.data.seatIndex = newData.seatIndex;
		this.data.seated = newData.seated;
		this.data.stand = newData.stand;
		this.data.busted = newData.busted;
		this.UpdateCards(newData.cards);
	}

	/** This functions checks if the current player already holds that card. */
	public IsDuplicate(card: Card): boolean
	{
		for (const hcard of this.data.cards)
		{
			if (card.id === hcard.id)
			{
				return true;
			}
		}
		return false;
	}

	/** This function creates a json string from a playerdata object. */
	public static BuildPlayerData(data: PlayerData): string
	{
		return JSON.stringify(
			{
			  	fullName: data.fullName,
			  	seatIndex: data.seatIndex,
			  	seated: data.seated,
			  	stand: data.stand,
			  	busted: data.busted,
			  	cards: data.cards
			}
		);
	}
}