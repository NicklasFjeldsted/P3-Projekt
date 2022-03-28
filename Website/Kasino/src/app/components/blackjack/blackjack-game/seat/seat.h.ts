import { Card } from "../cards";

export interface ISeat
{
	fullName: string;
	entityID: string;
	seatIndex: number;
	seated: boolean;
	stand: boolean;
	busted: boolean;
	cards: Card[];
}