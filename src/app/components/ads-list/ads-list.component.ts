import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { GetAdsService } from 'src/app/services/getAds.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';

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

    constructor(
        private app: AppComponent,
        public getAds: GetAdsService,
        private authService: AuthService,
        private profileService: ProfileService
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
        event.target.classList.toggle('opacity-img');
        document.querySelector("body").classList.toggle('stop-scroll');
        this.app.overlay = true;
        if (event.target.classList.contains('zoomed-img')) {
            this.app.overlay = false;
        }
        setTimeout(function () {
            event.target.classList.toggle('zoomed-img');
        }, 25);
    }

}
