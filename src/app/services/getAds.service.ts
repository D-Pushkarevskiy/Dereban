import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

import { AdInfoService } from 'src/app/services/adInfo.service';

import { AppComponent } from 'src/app/app.component';

@Injectable()

export class GetAdsService {

    public tmp;
    public detailClass = false;
    response_text = '';
    API_URL = this.app.API_URL;
    authToken = localStorage.getItem('authToken');

    constructor(
        private app: AppComponent,
        private http: HttpClient,
        public snackBar: MatSnackBar,
        private adInfoService: AdInfoService,
    ) {

    }

    GetShowCases(params, case_name) {
        this.authToken = localStorage.getItem('authToken');
        this.http.get(this.API_URL + '?func=get_show_cases' + params
        ).subscribe(response => {
            var tmp;
            tmp = response;
            if (tmp['code'] == 0) {
                this.tmp = tmp['text'];
                if (case_name) {
                    this.adInfoService.setCaseName(this.tmp[0]['case_name']);
                }
                if (this.authToken && this.authToken != '') {
                    this.GetActiveFavorite();
                }
            } else {
                this.tmp = false;
            }
        });
    }

    ChangeRating(type, case_id) {
        this.authToken = localStorage.getItem('authToken');
        this.http.get(this.API_URL + '?func=showcase_change_rating&authToken=' + this.authToken + '&case_id=' + case_id + '&type=' + type
        ).subscribe(response => {
            var tmp;
            tmp = response;
            if (tmp['code'] == 2) {
                this.GetShowCaseRating(case_id);
                this.GetUserRating(case_id);
            } else if (tmp['code'] == 0) {
                this.response_text = tmp['text'];
                this.Snackbar_message(this.response_text);
            }
        });
    }

    GetShowCaseRating(case_id) {
        this.http.get(this.API_URL + '?func=showcase_get_rating&case_id=' + case_id
        ).subscribe(response => {
            var tmp;
            tmp = response;

            var cur_arr = this.tmp.filter(x => x.id === case_id);
            cur_arr[0]['case_rating'] = tmp['text'];
        });
    }

    GetUserRating(case_id) {
        this.http.get(this.API_URL + '?func=get_user_rating&case_id=' + case_id
        ).subscribe(response => {
            var tmp;
            tmp = response;

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

    ToggleFavorite(case_id) {
        this.authToken = localStorage.getItem('authToken');
        this.http.get(this.API_URL + '?func=showcase_toggle_favorite&case_id=' + case_id + '&authToken=' + this.authToken
        ).subscribe(response => {
            var tmp;
            tmp = response;

            if (tmp['code'] === 0) {
                this.response_text = tmp['text'];
                this.Snackbar_message(this.response_text);
                this.GetActiveFavorite();
            }
        });
    }

    GetActiveFavorite() {
        this.authToken = localStorage.getItem('authToken');
        if (this.authToken && this.authToken != '') {
            this.http.get(this.API_URL + '?func=get_active_favorite&authToken=' + this.authToken
            ).subscribe(response => {
                var tmp;
                tmp = response;

                if (tmp['code'] === 0) {
                    // Сбрасываем все активные избранные объявы
                    for (let ads of this.tmp) {
                        ads['favorite'] = false;
                    }
                    //Все ок, раздаем статусы избранного объявлениям
                    for (let id of tmp['text']) {
                        var active_ads = this.tmp.filter(x => x.id === id);
                        for (let ads of active_ads) {
                            ads['favorite'] = true;
                        }
                    }
                } else if (tmp['code'] === 1) {
                    for (let ads of this.tmp) {
                        ads['favorite'] = false;
                    }
                }
            });
        }
    }

    SetFavoriteNull() {
        // Сбрасываем все активные избранные объявы
        for (let ads of this.tmp) {
            ads['favorite'] = false;
        }
    }

    isActive(case_id, act) {
        var cur_arr = this.tmp.filter(x => x.id === case_id);
        if (cur_arr[0]['case_rating'] == act) {
            return 'active';
        } else {
            return '';
        }
    }

    isFavorite(case_id) {
        var cur_arr = this.tmp.filter(x => x.id === case_id);
        if (cur_arr[0]['favorite'] == true) {
            return true;
        } else {
            return false;
        }
    }

    GetShowClass(rating) {
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

    Snackbar_message(msg_text) {
        if (msg_text != '') {
            let snackBarRef = this.snackBar.open(msg_text, '', {
                duration: 3000,
            });
        }
    }
}