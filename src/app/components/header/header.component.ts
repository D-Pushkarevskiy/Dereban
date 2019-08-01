import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';

import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { GetAdsService } from 'src/app/services/getAds.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

import { LoginComponent } from 'src/app/components/login/login.component';
import { AppComponent } from 'src/app/app.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    isAuth: Boolean;
    subscription: Subscription;
    subscription_name: Subscription;
    matTooltipText: String = '';
    user_id: Number;
    user_name: String;
    user_rating: Number;
    user_photo: String = 'user_profile_image_default.jpg';
    allads: String = 'allads/';
    favorites: String = 'favorites/';
    API_URL: String = this.app.API_URL;

    constructor(
        private app: AppComponent,
        public dialogRef: MatDialog,
        private authService: AuthService,
        private profileService: ProfileService,
        private http: HttpClient,
        public getAds: GetAdsService,
        private snackbar: SnackbarService
    ) {
        this.subscription = this.authService.getState().subscribe(state => {
            this.isAuth = state.value;
        });
    }

    ngOnInit() {
        if (this.authService.getAuthorizationToken()) {
            this.isAuth = true;
            if (this.isAuth == true) {
                // Запрос на данные пользователя
                this.GetUserData();
                //Запрос на рейтинг пользователя
                this.GetUserRating();
                //Очищаем текст тултипера
                this.matTooltipText = "";
                //Подписываемся на изменение имени (Профиль)
                this.subscription_name = this.profileService.getName().subscribe(uName => {
                    this.user_name = uName.value;
                });
            } else {
                //Добавляем текст тултипера
                this.matTooltipText = 'Добавление доступно только авторизированным пользователям';
            }
        }
    }

    OpenModal() {
        this.dialogRef.open(LoginComponent, {
            width: '500px'
        });
    }

    logOut() {
        this.authService.logOut();
        this.getAds.SetFavoriteNull();
    }

    GetUserData() {
        this.http.get(this.API_URL + '?func=get_user_data'
        ).subscribe(response => {
            if (response['code'] === 0) {
                this.user_id = response['text']['id'];
                this.user_name = response['text']['name'];
                this.user_photo = response['text']['photo'];
            } else if (response['code'] === 1) {
                this.snackbar.show_message(response['text']);
            }
        });
    }

    GetUserRating() {
        this.http.get(this.API_URL + '?func=get_user_rating'
        ).subscribe(response => {
            var tmp;
            tmp = response;

            if (tmp['code'] === 0) {
                //Все ок, записываем рейтинг пользователя
                this.user_rating = tmp['text'];
            } else if (tmp['code'] === 1) {
                this.snackbar.show_message(tmp['text']);
            }
        });
    }

    ratingColor(rating) {
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

}
