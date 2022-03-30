import { Observable } from "rxjs";

export interface IBeforeUnload
{
	beforeUnload(): Observable<boolean> | Promise<boolean> | boolean;
}