import { Vector2 } from "../utils";
import { Node } from "./node";

export const mockNodeFactory = (
	start = new Vector2(0, 0),
	end = new Vector2(1, 1),
	index = new Vector2(0, 0)
): Node => new Node(start, end, index);