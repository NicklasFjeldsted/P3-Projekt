import { Component, OnInit } from '@angular/core';
import { AuthGuard } from 'src/app/guards/auth-guard.services';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private auth: AuthGuard) { }

  ngOnInit(): void {
    this.auth.canActivate();
  }

  logOut() {
    localStorage.removeItem("token");
  }


}
