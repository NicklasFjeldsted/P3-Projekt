import { mockFleetFactory } from "../fleet";
import { mockNodeFactory } from "../node";
import { Ship } from "./ship";

export const mockShipFactory = (fleet = mockFleetFactory(), node = mockNodeFactory()): Ship => new Ship(fleet, node);