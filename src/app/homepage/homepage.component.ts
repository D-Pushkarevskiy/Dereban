import {Component, OnInit} from '@angular/core';
import {AppComponent} from 'src/app/app.component';
import {Title} from '@angular/platform-browser';
import {AdsListComponent} from 'src/app/ads-list/ads-list.component';
import {getAdsService} from 'src/app/shared/getAds.service';

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
        public getAds: getAdsService,
    ) {
        this.app.contentHeader = ' ';
        this.titleService.setTitle('"Dereban.ua" бесплатная площадка объявлений на велотематику');
    }

    ngOnInit() {
        this.adsList.getAds.GetShowCases('', false);
        this.getAds.detailClass = false;
    }
}
