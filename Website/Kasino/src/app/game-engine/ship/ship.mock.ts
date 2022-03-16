import { mockFleetFactory } from "../fleet";
import { Ship } from "./ship";

export const mockShipFactory = (fleet = mockFleetFactory()): Ship => new Ship(fleet);