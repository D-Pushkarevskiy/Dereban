import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { GetAdsService } from 'src/app/services/getAds.service';
import { AuthService } from 'src/app/services/auth.service';

import { AppComponent } from 'src/app/app.component';
import { AdsListComponent } from 'src/app/components/ads-list/ads-list.component';

@Component({
    selector: 'app-favorites-ads',
    templateUrl: './favorites-ads.component.html',
    styleUrls: ['./favorites-ads.component.css']
})
export class FavoritesAdsComponent implements OnInit {

    authToken = this.authService.getAuthorizationToken();
    contentHeader = 'Избранные объявления';

    constructor(
        private app: AppComponent,
        private titleService: Title,
        private adsList: AdsListComponent,
        public getAds: GetAdsService,
        private authService: AuthService,
    ) { }

    ngOnInit() {
        this.app.contentHeader = this.contentHeader;
        this.titleService.setTitle(this.contentHeader);
        this.adsList.getAds.GetShowCases('&authToken=' + this.authToken, false);
        this.getAds.detailClass = false;
    }

}
