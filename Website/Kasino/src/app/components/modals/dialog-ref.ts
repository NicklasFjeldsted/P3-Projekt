import { OverlayRef } from '@angular/cdk/overlay';
import { Subject, Observable, filter, take } from 'rxjs';
import { IndbetalComponent } from './indbetal/indbetal.component';

/**
 A reference to the dialog itself.
 Can be injected into the component added to the overlay and then used to close itself.
 */
export class DialogRef 
{
  private afterClosedSubject = new Subject<any>();

  constructor(private overlayRef: OverlayRef) {}

  /* Closes the overlay. You can optionally provide a result */
  public close(result?: any) 
  {
    this.overlayRef.backdropElement?.classList.add('animateOut')
    setTimeout(() => {this.overlayRef.dispose();}, 400);
    this.afterClosedSubject.next(result);
    this.afterClosedSubject.complete();
  }

  /* An Observable that notifies when the overlay has closed */
  public afterClosed(): Observable<any> 
  {
    return this.afterClosedSubject.asObservable();
  }
}
