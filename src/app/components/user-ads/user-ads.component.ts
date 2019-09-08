import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { GetAdsService } from 'src/app/services/get-ads.service';

import { AppComponent } from 'src/app/app.component';
import { AdsListComponent } from 'src/app/components/ads-list/ads-list.component';

@Component({
    selector: 'app-user-ads',
    templateUrl: './user-ads.component.html',
    styleUrls: ['./user-ads.component.css']
})
export class UserAdsComponent implements OnInit {

    private id: number;
    private subscription: Subscription;
    contentHeader = '';
    API_URL = this.app.API_URL;

    constructor(
        private activateRoute: ActivatedRoute,
        private http: HttpClient,
        private app: AppComponent,
        private titleService: Title,
        private router: Router,
        private adsList: AdsListComponent,
        public getAds: GetAdsService,
    ) {
        this.subscription = activateRoute.params.subscribe(params => this.id = params['id']);
    }

    ngOnInit() {
        this.getTitleForUserAdsComp();
        this.adsList.getAds.GetShowCases('&user_id=' + this.id, false);
        this.getAds.detailClass = false;
    }

    getTitleForUserAdsComp() {
        this.http.get(this.API_URL + '?func=get_title_for_user_ads_component&id=' + this.id
        ).subscribe(response => {
            var tmp;
            tmp = response;
            if (tmp['code'] == 0) {
                this.contentHeader = tmp['text'];
                this.app.contentHeader = this.contentHeader;
                this.titleService.setTitle(this.contentHeader);
            } else if (tmp['code'] == 1) {
                //На страницу 404
                this.router.navigate(['/404']);
            }
        });
    }

}
