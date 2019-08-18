import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { AdInfoService } from 'src/app/services/adInfo.service';
import { GetAdsService } from 'src/app/services/getAds.service';

import { AppComponent } from 'src/app/app.component';
import { AdsListComponent } from 'src/app/components/ads-list/ads-list.component';

@Component({
    selector: 'app-ad-detail',
    templateUrl: './ad-detail.component.html',
    styleUrls: ['./ad-detail.component.css']
})
export class AdDetailComponent implements OnInit {

    private id: number;
    private subscription: Subscription;
    private subscriptionName: Subscription;
    private adsName: string = '';

    constructor(
        private app: AppComponent,
        private titleService: Title,
        private activateRoute: ActivatedRoute,
        private adInfoService: AdInfoService,
        private adsList: AdsListComponent,
        public getAds: GetAdsService,
    ) {
        this.subscription = activateRoute.params.subscribe(params => this.id = params['id']);
    }

    ngOnInit() {
        this.getAds.detailClass = true;
        this.adsList.getAds.GetShowCases('&id=' + this.id, true);
        this.subscriptionName = this.adInfoService.getCaseName().subscribe(uName => {
            this.adsName = uName.value;
            this.app.contentHeader = this.adsName;
            this.titleService.setTitle(this.adsName);
        });
    }
}
