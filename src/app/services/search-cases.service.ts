import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { CaseStorageService } from './case-storage.service';
import { AreasService } from './areas.service';

@Injectable({
  providedIn: 'root'
})
export class SearchCasesService {
  private searchItem = new Subject<any>();
  public termsLength: number = 0;

  constructor(
    public caseStorage: CaseStorageService,
    public areasService: AreasService
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

    for (let i = 0; i < cases.length; i++) {
      // Added searchTerms priority for sort
      cases[i].priority_searchTerms = 0;
      if (
        (searchObj.case_name && searchObj.case_name != '' && cases[i].case_name.toLowerCase().indexOf(searchObj.case_name.toLowerCase()) != -1
          || searchObj.case_name && searchObj.case_name != '' && cases[i].description.toLowerCase().indexOf(searchObj.case_name.toLowerCase()) != -1)
        && cases[i].active === '1') {
        resultCases.push(cases[i]);
        cases[i].priority_searchTerms++;
      }
      for (let j = 0; j < Object.keys(searchObj).length; j++) {
        searchingKey = Object.keys(searchObj)[j];
        // If key value not empty and exist
        if (searchObj[Object.keys(searchObj)[j]] && searchObj[Object.keys(searchObj)[j]] != '') {
          // If key value equal to key value of case
          if ((cases[i][searchingKey] === searchObj[Object.keys(searchObj)[j]] && searchingKey !== 'case_name') && cases[i].active === '1') {
            resultCases.push(cases[i]);
            cases[i].priority_searchTerms++;
          }
        }
      }
    }
    uniqueCases = resultCases.filter((cases, index) => {
      return index === resultCases.findIndex(obj => {
        return JSON.stringify(obj) === JSON.stringify(cases);
      });
    });

    return uniqueCases;
  }

  public sortBy(cases, sortingTerm) {
    var nearbyAreasArr;
    var i;
    var j;
    if (!sortingTerm || sortingTerm === '') {
      return;
    }
    if (sortingTerm === 'area') {
      nearbyAreasArr = this.areasService.getNearbyAreas('Николаевская область');
      if (!nearbyAreasArr) {
        return;
      }
      for (i = 0; i < cases.length; i++) {
        // Added area priority for sort
        cases[i].priority_area = 0;
        console.log('added area priority');
        for (j = 0; j < nearbyAreasArr.length; j++) {
          if (cases[i].user_area === nearbyAreasArr[j]) {
            cases[i].priority_area++;
            break;
          }
        }
      }
    }
  }

  public sortByPriority(cases) {
    var sortedCases;
    var listPropertyValues;
    var i;
    var j;

    for (i = 0; i < cases.length; i++) {
      listPropertyValues = Object.keys(cases[i]);
      cases[i].priority = 0;
      for (j = 0; j < listPropertyValues.length; j++) {
        if (listPropertyValues[j].startsWith('priority_') && cases[i][listPropertyValues[j]]) {
          cases[i].priority = cases[i].priority + cases[i][listPropertyValues[j]];
        }
      }
    }

    if (this.isEqualPriority(cases)) {
      return this.sortByAddingTime(cases);
    }

    sortedCases = cases.sort(function (a, b) {
      return b.priority - a.priority;
    });

    return sortedCases;
  }

  public sortByAddingTime(cases) {
    var sortedCases;
    sortedCases = cases.sort(function (a, b) {
      return b.adding_time_raw - a.adding_time_raw;
    });

    return sortedCases;
  }

  public removePriority(cases, sortingTerm) {
    var objPriorityParam = 'priority_' + sortingTerm;
    console.log('remove ' + sortingTerm);
    for (let i = 0; i < cases.length; i++) {
      delete cases[i][objPriorityParam];
    }
  }

  public isEqualPriority(cases) {
    var equal = true;
    var counter = 0;

    for (let i = 0; i < cases.length; i++) {
      if (cases[i].priority > 0) {
        counter += cases[i].priority;
        equal = false;
      }
    }

    // If all cases priority is equal
    if (counter === cases.length) {
      equal = true;
    }

    console.log(equal);

    return equal;
  }
}
