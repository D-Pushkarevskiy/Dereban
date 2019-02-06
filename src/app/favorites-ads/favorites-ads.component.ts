import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {AppComponent} from 'src/app/app.component';
import {Title} from '@angular/platform-browser';
import {getAdsService} from 'src/app/shared/getAds.service';
import {AdsListComponent} from 'src/app/ads-list/ads-list.component';

@Component({
    selector: 'app-favorites-ads',
    templateUrl: './favorites-ads.component.html',
    styleUrls: ['./favorites-ads.component.css']
})
export class FavoritesAdsComponent implements OnInit {

    authToken = localStorage.getItem('authToken');
    contentHeader = 'Избранные объявления';

    constructor(
        private app: AppComponent,
        private titleService: Title,
        private adsList: AdsListComponent,
        public getAds: getAdsService,
    ) {}

    ngOnInit() {
        this.app.contentHeader = this.contentHeader;
        this.titleService.setTitle(this.contentHeader);
        this.adsList.getAds.GetShowCases('&authToken=' + this.authToken, false);
        this.getAds.detailClass = false;
    }

}