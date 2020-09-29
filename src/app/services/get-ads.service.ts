import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';

import { Subscription, Subject, Observable } from 'rxjs';

import { AdInfoService } from 'src/app/services/ad-info.service';
import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service'
import { CaseStorageService } from './case-storage.service';
import { UserDataService } from './user-data.service';

import { AppComponent } from 'src/app/app.component';
import { ConfirmationDialogComponent } from '../components/shared/confirmation-dialog/confirmation-dialog.component';

@Injectable()

export class GetAdsService {

  public tmp;
  public allCases;
  public detailClass: Boolean = false;
  public myShowcasesState: Boolean = false;
  public minValue;
  public maxValue;

  private API_URL = this.app.API_URL;
  private authToken = this.authService.getAuthToken();
  public subscription: Subscription;
  public isAuth: Boolean;
  private minPrice = new Subject<any>();
  private maxPrice = new Subject<any>();

  constructor(
    private app: AppComponent,
    public http: HttpClient,
    private adInfoService: AdInfoService,
    private authService: AuthService,
    private snackbar: SnackbarService,
    public dialog: MatDialog,
    public caseStorage: CaseStorageService,
    private userDataService: UserDataService
  ) {
    this.subscription = this.authService.getState().subscribe(state => {
      this.isAuth = state.value;
    });
  }

  public GetShowCases(params, case_name) {
    this.http.get(this.API_URL + '?func=get_show_cases' + params
    ).subscribe(response => {
      let tmp = response;
      if (tmp['code'] == 0) {
        this.tmp = tmp['text'];
        this.caseStorage.setCases(tmp['text']);
        this.allCases = tmp['text'];
        this.getMinMaxPrice(tmp['text']);
        if (case_name) {
          this.adInfoService.setCaseName(this.tmp[0]['case_name']);
        }
        if (this.authToken && this.authToken != '') {
          this.GetActiveFavorite();
          this.GetActiveRating();
        }
      } else {
        this.tmp = false;
      }
    })
  }

  public getMinMaxPrice(cases) {
    var sortedCases = cases;

    if (!sortedCases) {
      return null;
    }

    sortedCases = cases.concat().sort(function (a, b) {
      return parseInt(a.price) - parseInt(b.price);
    });

    this.setMinPrice(sortedCases[0].price); // min
    this.setMaxPrice(sortedCases[cases.length - 1].price); // max
  }

  setMaxPrice(maxPrice) {
    this.maxPrice.next({ value: maxPrice });
  }

  getMaxPrice(): Observable<any> {
    return this.maxPrice.asObservable();
  }

  setMinPrice(minPrice) {
    this.minPrice.next({ value: minPrice });
  }

  getMinPrice(): Observable<any> {
    return this.minPrice.asObservable();
  }

  public DeleteShowCase(case_id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: "Ваш <b>рейтинг</b> зависит от рейтинга Ваших объявлений. <br>Вы действительно хотите удалить объявление?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.get(this.API_URL + '?func=delete_showcase&case_id=' + case_id
        ).subscribe(response => {
          this.snackbar.show_message(response['text']);
          this.GetShowCases('', false);
          this.userDataService.getUserData();
        });
      }
    });
  }

  public ToggleActive(case_id: number) {
    this.http.get(this.API_URL + '?func=showcase_toggle_active&case_id=' + case_id
    ).subscribe(response => {
      let tmp = response;
      if (tmp['code'] != 2) {
        var cur_arr = this.tmp.filter(x => x.id === case_id);
        cur_arr[0]['active'] = tmp['code'];
      }
      this.snackbar.show_message(tmp['text']);
    });
  }

  public ChangeRating(type, case_id) {
    this.http.get(this.API_URL + '?func=showcase_change_rating&case_id=' + case_id + '&type=' + type
    ).subscribe(response => {
      let tmp = response;
      if (tmp['code'] == 2) {
        this.GetShowCaseRating(case_id);
        this.GetUserRating(case_id);
        this.GetActiveRating();
      } else if (tmp['code'] == 0) {
        this.snackbar.show_message(tmp['text']);
      }
    });
  }

  public GetShowCaseRating(case_id) {
    this.http.get(this.API_URL + '?func=showcase_get_rating&case_id=' + case_id
    ).subscribe(response => {
      let tmp = response;

      var cur_arr = this.tmp.filter(x => x.id === case_id);
      cur_arr[0]['case_rating'] = tmp['text'];
    });
  }

  public GetActiveRating() {
    if (this.authToken && this.authToken != '') {
      this.http.get(this.API_URL + '?func=get_active_rating'
      ).subscribe(response => {
        let tmp = response;

        if (tmp['code'] === 0) {
          // Сбрасываем все активные рейтинги объявы
          for (let ads of this.tmp) {
            ads['rating'] = false;
          }
          //Все ок, раздаем статусы активных рейтингов объявлениям
          for (let active_arr of tmp['text']) {
            var active_ads = this.tmp.filter(x => x.id === active_arr.id);
            for (let ads of active_ads) {
              ads['rating'] = active_arr.value;
            }
          }
        } else if (tmp['code'] === 1) {
          for (let ads of this.tmp) {
            ads['rating'] = false;
          }
        }
      });
    }
  }

  public GetUserRating(case_id) {
    this.http.get(this.API_URL + '?func=get_user_rating&case_id=' + case_id
    ).subscribe(response => {
      let tmp = response;

      if (tmp['code'] === 0) {
        //Все ок, записываем рейтинг пользователя
        var cur_arr = this.tmp.filter(x => x.id === case_id);
        var user_id = cur_arr[0]['user_id'];
        var cur_arr_user = this.tmp.filter(x => x.user_id === user_id);
        for (let ads of cur_arr_user) {
          ads['user_rating'] = tmp['text'];
        }
      }
    });
  }

  public ToggleFavorite(case_id) {
    this.http.get(this.API_URL + '?func=showcase_toggle_favorite&case_id=' + case_id
    ).subscribe(response => {
      let tmp = response;

      if (tmp['code'] === 0) {
        this.snackbar.show_message(tmp['text']);
        this.GetActiveFavorite();
      }
    });
  }

  public GetActiveFavorite() {
    if (this.authToken && this.authToken != '') {
      this.http.get(this.API_URL + '?func=get_active_favorite'
      ).subscribe(response => {
        let tmp = response;

        if (tmp['code'] === 0) {
          // Сбрасываем все активные избранные объявы
          this.SetFavoriteNull();
          //Все ок, раздаем статусы избранного объявлениям
          for (let id of tmp['text']) {
            var active_ads = this.tmp.filter(x => x.id === id);
            for (let ads of active_ads) {
              ads['favorite'] = true;
            }
          }
        } else if (tmp['code'] === 1) {
          this.SetFavoriteNull();
        }
      });
    }
  }

  public SetFavoriteNull() {
    // Сбрасываем все активные избранные объявы
    for (let ads of this.tmp) {
      ads['favorite'] = false;
    }
  }

  public isActive(case_id, type) {
    var cur_arr = this.tmp.filter(x => x.id === case_id);
    if (cur_arr[0]['rating'] === type) {
      return true;
    } else {
      return false;
    }
  }

  public isFavorite(case_id) {
    var cur_arr = this.tmp.filter(x => x.id === case_id);
    if (cur_arr[0]['favorite'] === true) {
      return true;
    } else {
      return false;
    }
  }

  public GetShowClass(rating) {
    if (rating === 0) {
      return 'color-gray';
    } else if (rating > 0) {
      return 'color-green';
    } else if (rating < 0) {
      return 'color-red';
    } else {
      return 'color-gray';
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
