import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { CaseStorageService } from './case-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SearchCasesService {
  private searchItem = new Subject<any>();
  public termsLength: number = 0;

  constructor(
    public caseStorage: CaseStorageService
  ) { }

  public setSearchItem(term, item) {
    this.searchItem.next([term, item]);
  }

  public getSearchItem(): Observable<any> {
    return this.searchItem.asObservable();
  }

  public removeSearchItem(term) {
    this.searchItem.next([term, '']);
  }

  public search(cases, searchObj) {
    var resultCases = [];
    var searchingKey = '';
    var uniqueCases;
    var sortedCases;

    for (let i = 0; i < cases.length; i++) {
      // Добавляем приоритет для сортировки
      cases[i].priority = 0;
      if (
        (searchObj.case_name && searchObj.case_name != '' && cases[i].case_name.toLowerCase().indexOf(searchObj.case_name.toLowerCase()) != -1
        || searchObj.case_name && searchObj.case_name != '' && cases[i].description.toLowerCase().indexOf(searchObj.case_name.toLowerCase()) != -1)
        && cases[i].active === '1') {
        resultCases.push(cases[i]);
        cases[i].priority++
      }
      for (let j = 0; j < Object.keys(searchObj).length; j++) {
        searchingKey = Object.keys(searchObj)[j];
        // Если ключ не пустой
        if (searchObj[Object.keys(searchObj)[j]] && searchObj[Object.keys(searchObj)[j]] != '') {
          // Если значение ключа совпадает со значением ключа объявления
          if ((cases[i][searchingKey] === searchObj[Object.keys(searchObj)[j]] && searchingKey !== 'case_name') && cases[i].active === '1') {
            resultCases.push(cases[i]);
            cases[i].priority++
          }
        }
      }
    }
    uniqueCases = resultCases.filter((cases, index) => {
      return index === resultCases.findIndex(obj => {
        return JSON.stringify(obj) === JSON.stringify(cases);
      });
    });
    sortedCases = uniqueCases.sort(function(a,b){
      return b.priority - a.priority;
    });
    return sortedCases;
  }
}
