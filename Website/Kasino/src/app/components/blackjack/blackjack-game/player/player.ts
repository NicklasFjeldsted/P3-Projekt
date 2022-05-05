import { Subject } from "rxjs";
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
	public customerID: number;
	public email: string;
	public seatIndex: number;
	public seated: boolean;
	public stand: boolean;
	public busted: boolean;
	public winner: boolean;
	public cards: Card[];
	public betAmount: number;

	constructor(name?: string)
	{
		this.fullName = name ? name : "No Name";
		this.seatIndex = -1;
		this.customerID = -1;
		this.betAmount = 0;
		this.seated = false;
		this.stand = false;
		this.busted = false;
		this.winner = false;
		this.cards = [];
	}
}

export class Player
{
	public static OnDataChanged: Subject<PlayerData> = new Subject<PlayerData>();

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
		this.data.cards = [];
		for (const card of cards)
		{
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
		this.data.winner = newData.winner;
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
				email: data.email,
				winner: data.winner,
				customerID: data.customerID,
			  	seatIndex: data.seatIndex,
			  	seated: data.seated,
			  	stand: data.stand,
			  	busted: data.busted,
			  	cards: data.cards
			}
		);
	}
}