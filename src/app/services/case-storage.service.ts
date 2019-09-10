import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CaseStorageService {

  public cases: Array<any>;

  constructor() { }

  public setCases(cases) {
    this.cases = cases;
  }

  public getCases() {
    return this.cases;
  }
}
