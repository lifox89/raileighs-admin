import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EventTypes } from "src/app/shared/constants/enum";
import { ToastEvent } from "src/app/shared/model/utilities";

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {


  toastEvents: Observable<ToastEvent>;
  private _toastEvents = new Subject<ToastEvent>();

  constructor() { 
    this.toastEvents = this._toastEvents.asObservable();
  }

}
