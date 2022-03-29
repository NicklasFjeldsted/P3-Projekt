import { Card } from "../cards";

export interface ISeat
{
	occupied: boolean;
	fullName: string;
	seatIndex: number;
	seated: boolean;
	stand: boolean;
	busted: boolean;
	cards: Card[];
}