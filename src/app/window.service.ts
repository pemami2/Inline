import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class WindowService {

  public get windowRef() {
    return window
  }
}
