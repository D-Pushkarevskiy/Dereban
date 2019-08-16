import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { GetAdsService } from 'src/app/services/getAds.service';

import { AppComponent } from 'src/app/app.component';
import { AdsListComponent } from 'src/app/components/ads-list/ads-list.component';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

    contentHeader = '';

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
}
