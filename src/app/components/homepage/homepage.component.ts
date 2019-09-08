import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { GetAdsService } from 'src/app/services/get-ads.service';

import { AppComponent } from 'src/app/app.component';
import { AdsListComponent } from 'src/app/components/ads-list/ads-list.component';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

    contentHeader = '';
    searchTimeout = null;

    constructor(
        private app: AppComponent,
        private titleService: Title,
        private adsList: AdsListComponent,
        public getAds: GetAdsService,
    ) {
        this.app.contentHeader = ' ';
        this.titleService.setTitle('"Dereban.ua" купи, продай, катай');
    }

    ngOnInit() {
        this.adsList.getAds.GetShowCases('', false);
        this.getAds.detailClass = false;
    }

    public searchItems(searchValue: string): void {
        if (!searchValue || searchValue === '') {
            return;
        }
        if (this.searchTimeout !== null) {
            clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = setTimeout(function () {
            this.searchTimeout = null;
            console.log(searchValue);
        }, 1000);
    }
}
