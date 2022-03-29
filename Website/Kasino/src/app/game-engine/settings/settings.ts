import { Color } from "../utils";

export const Settings = Object.freeze({ 
	grid: { // This is the settings for all things grid related.
		dimension: 6,
		nodeSize: 100,
		nodeOffset: 10,
		color: {
			regular: new Color(35, 39, 42, 1),
			active: new Color(215, 215, 215, 1)
		}
	},
	ships: { // This is the settings for all things ship related.
		fleetSize: 3,
		colors: { // Team colors.
			a: new Color(187, 222, 251, 1),
			b: new Color(255, 236, 179, 1)
		},
		radius: 40
	}
})