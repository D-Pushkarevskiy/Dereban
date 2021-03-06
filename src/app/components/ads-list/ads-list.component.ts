import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';

import { GetAdsService } from 'src/app/services/get-ads.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { SearchCasesService } from 'src/app/services/search-cases.service';

import { AppComponent } from 'src/app/app.component';

@Component({
    selector: 'app-ads-list',
    templateUrl: './ads-list.component.html',
    styleUrls: ['./ads-list.component.scss']
})
export class AdsListComponent implements OnInit {
    isAuth: Boolean = this.getAds.isAuth;
    subscription_id: Subscription;
    subscription: Subscription;
    user_id: number;
    private user_image_default: string = 'user_profile_image_default.jpg';

    constructor(
        private app: AppComponent,
        public getAds: GetAdsService,
        private authService: AuthService,
        private profileService: ProfileService,
        public searchService: SearchCasesService,
        private translateService: TranslateService
    ) {
        this.subscription = this.authService.getState().subscribe(state => {
            this.isAuth = state.value;
        });
        //Подписываемся на id
        this.subscription_id = this.profileService.getId().subscribe(uId => {
            this.user_id = uId.value;
        });
    }

    ngOnInit() { }

    ZoomImage(event: any) {
        document.querySelector("body").classList.toggle('stop-scroll');
        this.app.overlay = true;
        if (event.target.classList.contains('zoomed-img')) {
            this.app.overlay = false;
        }
        setTimeout(function () {
            event.target.classList.toggle('zoomed-img');
            setTimeout(function () {
                event.target.classList.toggle('allow-transition');
                event.target.classList.toggle('opacity-img');
            }, 25);
        }, 25);
    }

    ifNeedToShow(item) {
        if (item.hasOwnProperty('priority') && this.isAuth && !item.show || item.hasOwnProperty('priority') && item.active === '0' && !item.show || item.hideByFilter || item.hideByFilterArea) {
            return false;
        }

        return true;
    }

    public formatDate(date) {
        if (typeof date === 'object') {
            return this.translateService.instant(date.alias) + ' ' + date.time;
        }

        return date;
    }

    searchByTag(tag, value) {
        this.searchService.setSearchItem(tag, value);
    }

}
