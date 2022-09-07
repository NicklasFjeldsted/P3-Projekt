export interface IUpdate
{
	/** This method will be called every frame, the deltaTime is the time that passed since the last frame call. */
	Update(deltaTime: number): void;
}