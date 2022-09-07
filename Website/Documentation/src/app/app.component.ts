import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { connectFirestoreEmulator, Firestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit
{
	constructor(private firestore: Firestore) {}

	ngOnInit(): void
	{
		if (!environment.production)
		{
			connectFirestoreEmulator(this.firestore, 'localhost', 5001);
			console.warn("Connected to Emulator!");
		}
	}
	title = 'Documentation';

	active: boolean = false;

	height: number = 0;

	public toggle_sidebar(): void
	{
		this.active = !this.active;
	}

}

