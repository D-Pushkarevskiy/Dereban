import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AppComponent} from 'src/app/app.component';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {adInfoService} from 'src/app/shared/adInfo.service';
import {AdsListComponent} from 'src/app/ads-list/ads-list.component';
import {getAdsService} from 'src/app/shared/getAds.service';

@Component({
    selector: 'app-ad-detail',
    templateUrl: './ad-detail.component.html',
    styleUrls: ['./ad-detail.component.css']
})
export class AdDetailComponent implements OnInit {

    private id: number;
    private subscription: Subscription;
    private subscriptionName: Subscription;
    adsName = '';

    constructor(
        private app: AppComponent,
        private titleService: Title,
        private activateRoute: ActivatedRoute,
        private adInfoService: adInfoService,
        private adsList: AdsListComponent,
        public getAds: getAdsService,
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
