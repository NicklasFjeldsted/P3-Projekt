import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/User';
import { CustomerService } from 'src/app/services/customer.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent
{
  loading = false;
  users: User[];

  constructor(private customerService: CustomerService) { }

  ngOnInit() { }

  addActive(id: number): void {
    const nav = document.getElementById("navbar")!.children;
    for(let i = 0; i < 3; i++) {
      if(nav[i].classList.contains('active')) {
        nav[i].classList.remove('active');
      }
    }
    nav[id].classList.add('active');
  }
}
/* <div class="column flow-down">
<div class="self-center">
  <a routerLink="blackjack"><img src="assets/media/pic.png" alt="Blackjack" ></a> <!--Linker til blackjack-->
</div>
<div class="row center">
  <a class="btn bg-green" routerLink="blackjack">START SPILLET >></a> <!--Linker til blackjack-->
</div>
<div class="row center">
  <p>Blackjack</p>
</div>
<!-- textbox of images explation -->
<div class="row fit center">
  <p>Få 50 cash freespins ved NemID verificering, og op til 1.000 kr. i kontanter ved første indbetaling!</p>
</div>
</div>

<div class="column flow-down">
<div class="self-center">
  <a routerLink="/roulette"><img src="assets/media/homeRoulette.png" alt="Roulette" ></a> <!--Linker til roulette-->
</div>
<div class="row center">
  <a class="btn bg-green" routerLink="/roulette">START SPILLET >></a> <!--Linker til roulette-->
</div>
<div class="row center">
  <p>Roulette</p>
</div>
<!-- textbox of images explation -->
<div class="row fit center">
  <p>Få 50 cash freespins ved NemID verificering, og op til 1.000 kr. i kontanter ved første indbetaling!</p>
</div>
</div>

<div class="column flow-down">
<div class="self-center">
  <a routerLink="/slots"><img src="assets/media/homeSlots.png" alt="Slots" ></a> <!--Linker til slots-->
</div>
<div class="row center">
  <a class="btn bg-green" routerLink="/slots">START SPILLET >></a> <!--Linker til slots-->
</div>
<div class="row center">
  <p>Slots</p>
</div>
<!-- textbox of images explation -->
<div class="row fit center">
  <p>Få 50 cash freespins ved NemID verificering, og op til 1.000 kr. i kontanter ved første indbetaling!</p>
</div>
</div> */