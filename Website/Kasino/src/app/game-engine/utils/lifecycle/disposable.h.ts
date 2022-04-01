export interface IDisposable
{
	/** Disposes all references. */
	Dispose(): Promise<void> | void;
}