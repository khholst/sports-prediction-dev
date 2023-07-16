import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  public showAlert(alert: any, message: string, type: string, duration: number) {
    alert.isOpen = true;
    alert.message = message;
    alert.type = type;

    if (duration != -1) {
      setTimeout(() => {
        alert.isOpen = false;
      }, duration)
    }
  }
}
