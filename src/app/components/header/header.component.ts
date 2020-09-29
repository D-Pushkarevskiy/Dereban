import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatMenuTrigger } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { GetAdsService } from 'src/app/services/get-ads.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { LangService } from 'src/app/services/lang.service';
import { LoaderService } from 'src/app/services/loader.service';
import { DraftShowcaseService } from 'src/app/services/draft-showcase.service';
import { UserDataService } from 'src/app/services/user-data.service';

import { LoaderState } from '../../interfaces/loader';

import { LoginComponent } from 'src/app/components/login/login.component';
import { AppComponent } from 'src/app/app.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

    isAuth: Boolean;
    subscription_loader: Subscription;
    subscription: Subscription;
    subscription_name: Subscription;
    subscription_user_data: Subscription;
    addingDisableTooltip: String = '';
    user_id: Number;
    user_name: String;
    user_rating: Number;
    user_photo: String = 'user_profile_image_default.jpg';
    showcase_count: Number;
    showcase_limit: Number;
    allads: String = 'allads/';
    favorites: String = 'favorites/';
    API_URL: String = this.app.API_URL;
    show = false;
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
    scroll = (): void => { this.isAuth ? this.trigger.closeMenu() : ''; };

    constructor(
        private app: AppComponent,
        public dialogRef: MatDialog,
        private authService: AuthService,
        private profileService: ProfileService,
        private http: HttpClient,
        public getAds: GetAdsService,
        private snackbar: SnackbarService,
        private router: Router,
        private translate: TranslateService,
        private langService: LangService,
        private loaderService: LoaderService,
        private draftShowcase: DraftShowcaseService,
        private userDataService: UserDataService
    ) {
        // Значения по умолчанию
        this.showcase_count = 0;
        this.showcase_limit = 10;
        this.subscription = this.authService.getState().subscribe(state => {
            this.isAuth = state.value;

            if (this.isAuth == true) {
                // Запрос на данные пользователя
                this.GetUserData();
                //Запрос на рейтинг пользователя
                this.GetUserRating();
                //Очищаем текст тултипера
                this.addingDisableTooltip = "";
                //Подписываемся на изменение имени (Профиль)
                this.subscription_name = this.profileService.getName().subscribe(uName => {
                    this.user_name = uName.value;
                });
            } else {
                //Добавляем текст тултипера
                this.addingDisableTooltip = 'Добавление доступно только авторизированным пользователям';
            }
        });
        this.subscription_user_data = this.userDataService.userDataSubscriber().subscribe((s) => {
            if (s) {
                this.GetUserData();
            }
        });
        window.addEventListener('scroll', this.scroll, true);
    }

    ngOnInit() {
        this.subscription_loader = this.loaderService.loaderState
            .subscribe((state: LoaderState) => {
                this.show = state.show;
            });
    }

    OpenModal() {
        this.dialogRef.open(LoginComponent, {
            width: '500px'
        });
    }

    logOut() {
        this.authService.removeAuthToken();
        this.authService.logOut();
        this.router.navigate(['/']);
        this.getAds.SetFavoriteNull();
    }

    GetUserData() {
        this.http.get(this.API_URL + '?func=get_user_data'
        ).subscribe(response => {
            if (response['code'] === 0) {
                this.user_id = response['text']['id'];
                this.user_name = response['text']['name'];
                this.user_photo = response['text']['photo'] ? response['text']['photo'] : this.user_photo;
                // Передаем имя пользователя для ads-list
                this.profileService.setId(response['text']['id']);
                // Передаем область для сортировки
                this.profileService.setArea(response['text']['area']);
                // Подсчет уже созданных объявлений
                this.showcase_limit = response['text']['limit'];
                this.profileService.setShowcasesCount(response['text']['showcase_count'], this.showcase_limit);
                this.showcase_count = +response['text']['showcase_count'];
                // Добавляем текст тултипера если добавление более не доступно
                this.addingDisableTooltip = 'К сожалению лимит объявлений всего ' + this.showcase_limit + ' добавлений';
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

    isActiveLang(lang: string) {
        if (this.translate.currentLang === lang) {
            return true;
        }

        return false;
    }

    setLang(lang: string) {
        this.translate.use(lang);
        this.langService.setTranslateLang(lang);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.subscription_loader.unsubscribe();
    }

}
