import { Injectable, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private display: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  cast = this.display.asObservable();


  constructor() { }

  onModalChange() {
    this.display.next(!this.display.value)

  }
}
