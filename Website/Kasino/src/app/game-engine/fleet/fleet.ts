import { Entity } from "../utils";
import { Team } from "../team";

export class Fleet extends Entity
{
	constructor(public readonly Team: Team)
	{
		super();
	}
}