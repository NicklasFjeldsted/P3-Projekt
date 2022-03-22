import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Broadcast } from './broadcast';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit
{
  constructor(public authenticationService: AuthenticationService) { }

  @Output() onSideNavToggle: EventEmitter<void> = new EventEmitter<void>();

  currentBalance: number | null;

  ngOnInit(): void {
    Broadcast.Instance.onBalanceChange.subscribe(event => this.getBalance());
  }

  emitSideNavToggle(): void {
    this.onSideNavToggle.emit();
  }

  getBalance(): void {
    this.authenticationService.decodeToken().subscribe({
      next: (userBalance) => {
        this.currentBalance = userBalance.balance;
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
}



