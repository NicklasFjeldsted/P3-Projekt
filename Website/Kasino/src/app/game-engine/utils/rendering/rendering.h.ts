export interface IRendering
{
	get Changed(): boolean;
	/** Draw callback function. */
	Draw(): void;
	/** Clear callback function. */
	Clear(): void;
}