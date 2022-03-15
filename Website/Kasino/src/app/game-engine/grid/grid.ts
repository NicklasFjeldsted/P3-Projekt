import { Entity } from "../utils";
import { Node } from "../node";

export class Grid extends Entity
{ 
	private _nodes: Node[] = [];

	public get Nodes(): Node[]
	{
		return this._nodes;
	}
}