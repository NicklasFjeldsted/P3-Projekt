import { Overlay, ComponentType } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { EventEmitter, Injectable, Injector, Output } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { DialogRef } from "./dialog-ref";
import { DIALOG_DATA } from "./dialog-tokens";
import { IndbetalComponent } from "./indbetal/indbetal.component";

export interface DialogConfig {
  data?: any;
}

@Injectable({
  providedIn: "root",
})
export class DialogService {
  public showIndbetal = new Subject<boolean>();

  constructor(private overlay: Overlay, private injector: Injector) {}

  // Open modal
  open<T>(component: ComponentType<T>, config?: DialogConfig): ComponentType<T> 
  {
    // Globally centered position strategy
    const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();

    // Create the overlay with customizable options
    const overlayRef = this.overlay.create
    ({
      width: "250px",
      positionStrategy,
      hasBackdrop: true,
      backdropClass: "backdropBackground",
    });

    // Create dialogRef to return
    const dialogRef = new DialogRef(overlayRef);

    // Create injector to be able to reference the DialogRef from within the component
    const injector = Injector.create
    ({
      parent: this.injector,
      providers: 
      [
        { provide: DialogRef, useValue: dialogRef },
        { provide: DIALOG_DATA, useValue: config?.data },
      ],
    });

    // Attach component portal to the overlay
    const portal = new ComponentPortal(component, null, injector);
    overlayRef.attach(portal);

    return component;
  }
}
