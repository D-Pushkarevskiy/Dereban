import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { GetAdsService } from 'src/app/services/getAds.service';
import { AuthService } from 'src/app/services/auth.service';

import { AppComponent } from 'src/app/app.component';

@Component({
    selector: 'app-ads-list',
    templateUrl: './ads-list.component.html',
    styleUrls: ['./ads-list.component.css']
})
export class AdsListComponent implements OnInit {
    isAuth;
    subscription: Subscription;

    constructor(
        private app: AppComponent,
        public getAds: GetAdsService,
        private authService: AuthService
    ) {
        this.subscription = this.authService.getState().subscribe(state => {
            this.isAuth = state.value;
        });
    }

    ngOnInit() {}

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
