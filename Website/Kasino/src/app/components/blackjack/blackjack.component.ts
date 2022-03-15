import { Component, ElementRef, Injectable, OnInit } from '@angular/core';
import { Game } from 'src/app/game-engine';

@Component({
  selector: 'app-blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css']
})

@Injectable({ providedIn: 'root' })

export class BlackjackComponent implements OnInit {

  constructor(private elementRef: ElementRef) { }
  
  ngOnInit(): void
  {
    new Game(this.elementRef.nativeElement).Awake();
  }
}
