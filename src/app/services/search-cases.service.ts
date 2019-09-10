import { Injectable } from '@angular/core';

import { CaseStorageService } from './case-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SearchCasesService {

  constructor(
    public caseStorage: CaseStorageService
  ) { }

  public search(searchTerm) {
    var cases = this.caseStorage.getCases();
    searchTerm = searchTerm.toLowerCase();
    return cases.filter(it => {
      return it.case_name.toLowerCase().includes(searchTerm) || null;
    });
  }
}
