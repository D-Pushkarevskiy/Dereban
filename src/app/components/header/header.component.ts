import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';

import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { GetAdsService } from 'src/app/services/getAds.service';

import { LoginComponent } from 'src/app/components/login/login.component';
import { AppComponent } from 'src/app/app.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    isAuth;
    subscription: Subscription;
    subscription_name: Subscription;
    subscription_rating: Subscription;
    matTooltipText = "";
    user_id;
    user_name;
    user_rating;
    allads = 'allads/';
    favorites = 'favorites/';
    error_text = '';
    API_URL = this.app.API_URL;
    authToken;
    photoName = 'user_profile_image_default.jpg';

    constructor(
        private app: AppComponent,
        public dialogRef: MatDialog,
        private authService: AuthService,
        private profileService: ProfileService,
        private http: HttpClient,
        public snackBar: MatSnackBar,
        public getAds: GetAdsService,
    ) {
        this.subscription = this.authService.getState().subscribe(state => {
            this.isAuth = state.value;

            if (this.isAuth == true) {
                this.authToken = localStorage.getItem('authToken');
                //Запрос на id пользователя
                this.GetUserId();
                //Запрос на имя пользователя
                this.GetUserName();
                //Запрос на рейтинг пользователя
                this.GetUserRating();
                //Запрос на фотографию пользователя
                this.GetUserPhoto();
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
        });
    }

    ngOnInit() {

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

    GetUserId() {
        this.http.get(this.API_URL + '?func=get_user_id&authToken=' + this.authToken
        ).subscribe(response => {
            var tmp;
            tmp = response;

            if (tmp['code'] === 0) {
                //Все ок, записываем имя пользователя
                this.user_id = tmp['text'];
            } else if (tmp['code'] === 1) {
                this.error_text = tmp['text'];
                this.Snackbar_message(this.error_text);
            }
        });
    }

    GetUserName() {
        this.http.get(this.API_URL + '?func=get_user_name&authToken=' + this.authToken
        ).subscribe(response => {
            var tmp;
            tmp = response;

            if (tmp['code'] === 0) {
                //Все ок, записываем имя пользователя
                this.user_name = tmp['text'];
            } else if (tmp['code'] === 1) {
                this.error_text = tmp['text'];
                this.Snackbar_message(this.error_text);
            }
        });
    }

    GetUserRating() {
        this.http.get(this.API_URL + '?func=get_user_rating&authToken=' + this.authToken
        ).subscribe(response => {
            var tmp;
            tmp = response;

            if (tmp['code'] === 0) {
                //Все ок, записываем рейтинг пользователя
                this.user_rating = tmp['text'];
            } else if (tmp['code'] === 1) {
                this.error_text = tmp['text'];
                this.Snackbar_message(this.error_text);
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

    GetUserPhoto() {
        this.http.get(this.API_URL + '?func=get_user_photo&authToken=' + this.authToken
        ).subscribe(response => {
            var tmp;
            tmp = response;

            if (tmp['code'] == 0) {
                //Все ок, записываем урл фотографии
                this.photoName = tmp['text'];
            } else if (tmp['code'] === 1) {
                this.error_text = tmp['text'];
                this.Snackbar_message(this.error_text);
            }
        });
    }

    Snackbar_message(msg_text) {
        if (msg_text != '') {
            let snackBarRef = this.snackBar.open(msg_text, '', {
                duration: 3000,
            });
        }
    }
}
