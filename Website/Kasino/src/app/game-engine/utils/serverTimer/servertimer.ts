import { BehaviorSubject, Observable, Subject } from "rxjs";

export class ServerTimer
{
	private ServerTimeSubject: BehaviorSubject<number>;
	public OnServerTimeChanged: Observable<number>;
	
	private ElapsedSubject: Subject<void>;
	public Elapsed: Observable<void>;

	private _dueTime: Date = new Date();
	public get DueTime(): Date
	{
		return this._dueTime;
	}

	constructor()
	{
		this.ServerTimeSubject = new BehaviorSubject<number>(0);
		this.OnServerTimeChanged = this.ServerTimeSubject.asObservable();

		this.ElapsedSubject = new Subject<void>();
		this.Elapsed = this.ElapsedSubject.asObservable();

		setInterval(() =>
		{
			this.ServerTimeSubject.next(this._dueTime.getTime() - Date.now());
		}, 100);
	}

	public Start(newDueTime: any): void
	{
		this._dueTime = new Date(newDueTime.DueTime);
		this.ElapsedSubject.next();
	}
}