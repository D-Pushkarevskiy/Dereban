import { Injectable } from '@angular/core';

import { Observable, Subject, Subscription } from 'rxjs';

import { CaseStorageService } from './case-storage.service';
import { AreasService } from './areas.service';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root'
})
export class SearchCasesService {
  private searchItem = new Subject<any>();
  public termsLength: number = 0;
  private prevGroupValue = null;
  subscription_id: Subscription;
  subscription_area: Subscription;
  user_id: number;
  user_area: string;

  constructor(
    public caseStorage: CaseStorageService,
    public areasService: AreasService,
    private profileService: ProfileService
  ) {
    //Подписываемся на id
    this.subscription_id = this.profileService.getId().subscribe(uId => {
      this.user_id = uId.value;
    });
    //Подписываемся на область
    this.subscription_area = this.profileService.getArea().subscribe(uArea => {
      this.user_area = uArea.value;
    });
  }

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
    var searchingKey = '';

    for (let i = 0; i < cases.length; i++) {
      // Added searchTerms priority for sort
      cases[i].pr_searchTerms = 0;
      cases[i].gr_pr_searchTerms = 0;
      if (
        (searchObj.case_name && searchObj.case_name != '' && cases[i].case_name.toLowerCase().indexOf(searchObj.case_name.toLowerCase()) != -1
          || searchObj.case_name && searchObj.case_name != '' && cases[i].description.toLowerCase().indexOf(searchObj.case_name.toLowerCase()) != -1)
        && cases[i].active === '1' && this.user_id !== cases[i].user_id && !cases[i].hideByFilter && !cases[i].hideByFilterArea) {
        cases[i].pr_searchTerms++;
        cases[i].gr_pr_searchTerms++;
      }
      for (let j = 0; j < Object.keys(searchObj).length; j++) {
        searchingKey = Object.keys(searchObj)[j];
        // If key value not empty and exist
        if (searchObj[Object.keys(searchObj)[j]] && searchObj[Object.keys(searchObj)[j]] != '') {
          // If key value equal to key value of case
          if ((cases[i][searchingKey] === searchObj[Object.keys(searchObj)[j]] && searchingKey !== 'case_name') && cases[i].active === '1' && this.user_id !== cases[i].user_id && !cases[i].hideByFilter && !cases[i].hideByFilterArea) {
            cases[i].pr_searchTerms++;
            cases[i].gr_pr_searchTerms++;
          }
        }
      }
    }

    cases = this.sortByOrder(cases, 'pr_searchTerms');

    return this.sortByPriority(cases);
  }

  public sortBy(cases, sortingTerm) {
    var nearbyAreasArr;

    if (!sortingTerm || sortingTerm === '') {
      return;
    }
    if (sortingTerm === 'pr_area') {
      nearbyAreasArr = this.areasService.getNearbyAreas(this.user_area);
      if (!nearbyAreasArr) {
        return;
      }
      for (let i = 0; i < cases.length; i++) {
        // Added area priority for sort
        cases[i][sortingTerm] = 0;
        cases[i]['gr_' + sortingTerm] = 0;
        for (let j = 0; j < nearbyAreasArr.length; j++) {
          if (cases[i].user_area === nearbyAreasArr[j]) {
            cases[i][sortingTerm] = 1;
            cases[i]['gr_' + sortingTerm] = 1;
            break;
          }
        }
      }

      cases = this.sortByOrder(cases, sortingTerm);

    } else if (sortingTerm === 'pr_rating') {
      for (let i = 0; i < cases.length; i++) {
        cases[i][sortingTerm] = 0;
        cases[i]['gr_' + sortingTerm] = 0;
        if (cases[i].case_rating === null || cases[i].case_rating === 0) {
          cases[i][sortingTerm] = 0;
          cases[i]['gr_' + sortingTerm] = 0;
        } else {
          cases[i][sortingTerm] = parseInt(cases[i].case_rating);
          cases[i]['gr_' + sortingTerm] = parseInt(cases[i].case_rating) < 0 ? -1 : 1;
        }
      }

      cases = this.sortByOrder(cases, sortingTerm);

    } else if (sortingTerm === 'pr_price') {
      for (let i = 0; i < cases.length; i++) {
        cases[i][sortingTerm] = 0;
        cases[i]['gr_' + sortingTerm] = 0;
        if (cases[i].price === null || cases[i].price === 0) {
          cases[i][sortingTerm] = 0;
          cases[i]['gr_' + sortingTerm] = 0;
        } else {
          cases[i][sortingTerm] = parseInt(cases[i].price);
          cases[i]['gr_' + sortingTerm] = 1;
        }
      }

      cases = this.sortByOrder(cases, sortingTerm, true);

    }

    return this.sortByPriority(cases);
  }

  public sortByOrder(cases, sortTerm, reverse: boolean = false) {

    cases.sort(function (a, b) {
      return parseInt(a[sortTerm]) - parseInt(b[sortTerm]);
    });

    if (reverse) {
      cases.reverse();
    }

    for (let k = 0; k < cases.length; k++) {
      if (cases[k].active === '1' && this.user_id !== cases[k].user_id) {
        cases[k][sortTerm] = k;
      }
    }

    return cases;
  }

  public sortByPriority(cases) {
    var sortedCases;
    var listPropertyValues;

    for (let i = 0; i < cases.length; i++) {
      listPropertyValues = Object.keys(cases[i]);
      cases[i].priority = 0;
      cases[i].gr_priority = 0;
      for (let j = 0; j < listPropertyValues.length; j++) {
        if (listPropertyValues[j].startsWith('pr_') && cases[i][listPropertyValues[j]] && cases[i].active === '1' && this.user_id !== cases[i].user_id && !cases[i].hideByFilter && !cases[i].hideByFilterArea) {
          cases[i].priority = parseInt(cases[i].priority) + parseInt(cases[i][listPropertyValues[j]]);
        }
        if (listPropertyValues[j].startsWith('gr_pr_') && cases[i][listPropertyValues[j]] && cases[i].active === '1' && this.user_id !== cases[i].user_id && !cases[i].hideByFilter && !cases[i].hideByFilterArea) {
          cases[i].gr_priority += parseInt(cases[i][listPropertyValues[j]]);
        }
      }
    }

    if (this.isEqualPriority(cases)) {
      cases = this.deleteAllPrAndGr(cases);
      return this.sortByAddingTime(cases);
    }

    for (let i = 0; i < cases.length; i++) {
      cases[i].show = true;
      if (parseInt(cases[i].active) === 0 || this.user_id === cases[i].user_id) {
        cases[i].show = false;
        cases[i].priority = -1000;
      }
    }

    sortedCases = cases.sort(function (a, b) {
      return parseInt(b.priority) - parseInt(a.priority);
    });

    sortedCases = this.groupByPriority(sortedCases);

    return sortedCases;
  }

  public sortByAddingTime(cases) {
    var sortedCases;
    sortedCases = cases.sort(function (a, b) {
      return parseInt(b.adding_time_raw) - parseInt(a.adding_time_raw);
    });

    return sortedCases;
  }

  public deleteAllPrAndGr(cases) {
    var listPropertyValues;

    for (let i = 0; i < cases.length; i++) {
      listPropertyValues = Object.keys(cases[i]);

      for (let j = 0; j < listPropertyValues.length; j++) {
        if (listPropertyValues[j].startsWith('pr_') || listPropertyValues[j].startsWith('gr_')) {
          delete cases[i][listPropertyValues[j]];
        }
      }
      delete cases[i].priority;
    }

    return cases;
  }

  public removePriority(cases, sortingTerm) {
    for (let i = 0; i < cases.length; i++) {
      delete cases[i][sortingTerm];
      delete cases[i]['gr_' + sortingTerm];
    }

    return this.sortByPriority(cases);
  }

  public isEqualPriority(cases) {
    var equal = true;

    for (let i = 0; i < cases.length; i++) {
      cases[i].show = true;
      if (cases[i].priority > 0) {
        equal = false;
        break;
      }
    }

    return equal;
  }

  public groupByPriority(cases) {
    // Clear all previous priority names
    for (let d = 0; d < cases.length; d++) {
      delete cases[d].gr_priority_name;
    }

    // Adding 'best' pr_name or 'other'
    for (let i = 0; i < cases.length; i++) {
      // If sorting terms is less then 2 - break
      if (cases[0].gr_priority < 2) {
        break;
      }
      if (!cases[i].hideByFilter && !cases[i].hideByFilterArea) {
        if (this.prevGroupValue === null) {
          if (cases[i].gr_priority !== 0) {
            cases[i].gr_priority_name = 'best';
          } else {
            cases[i].gr_priority_name = 'not-found';
            break;
          }
        } else {
          if (this.prevGroupValue !== cases[i].gr_priority && cases[i].active === '1') {
            cases[i].gr_priority_name = 'other';
            break;
          }
        }
        this.prevGroupValue = cases[i].gr_priority;
      }
    }

    this.prevGroupValue = null;

    return cases;
  }

  public filterByPrice(cases, minValue, maxValue) {
    minValue = minValue || 0;
    maxValue = maxValue || 999999;

    for (let i = 0; i < cases.length; i++) {
      delete cases[i].hideByFilter;
      if (parseInt(cases[i].price) < minValue || parseInt(cases[i].price) > maxValue) {
        cases[i].hideByFilter = true;
      }
    }

    return this.sortByPriority(cases);
  }

  public filterByArea(cases, area) {
    if (!area || area === '') {
      for (let i = 0; i < cases.length; i++) {
        delete cases[i].hideByFilterArea;
      }

      return this.sortByPriority(cases);
    }

    for (let i = 0; i < cases.length; i++) {
      delete cases[i].hideByFilterArea;
      if (cases[i].user_area !== area) {
        cases[i].hideByFilterArea = true;
      }
    }

    return this.sortByPriority(cases);
  }

}
