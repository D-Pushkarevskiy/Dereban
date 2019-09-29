import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatChipInputEvent } from '@angular/material';

import { Subscription } from 'rxjs';

import { GetAdsService } from 'src/app/services/get-ads.service';
import { CaseStorageService } from 'src/app/services/case-storage.service';
import { SearchCasesService } from 'src/app/services/search-cases.service';
import { AuthService } from 'src/app/services/auth.service';

import { AppComponent } from 'src/app/app.component';
import { AdsListComponent } from 'src/app/components/ads-list/ads-list.component';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {

    contentHeader = '';
    searchTimeout = null;
    isAuth: Boolean = this.getAds.isAuth;
    subscription: Subscription;
    foundCases: Array<any> = [];
    subscription_item: Subscription;
    searchItem = {
        case_name: "",
        description: "",
        detail_type: "",
        direction: "",
        full_type: "",
        state: "",
        type: "",
        velo_type: "",
        wheel_size: ""
    };

    constructor(
        private app: AppComponent,
        private titleService: Title,
        private adsList: AdsListComponent,
        public getAds: GetAdsService,
        public caseStorage: CaseStorageService,
        public searchService: SearchCasesService,
        private authService: AuthService
    ) {
        this.app.contentHeader = ' ';
        this.titleService.setTitle('"Dereban.ua" купи, продай, катай');
        this.subscription = this.authService.getState().subscribe(state => {
            this.isAuth = state.value;
        });
        //Подписываемся на searchItem
        this.subscription_item = this.searchService.getSearchItem().subscribe(item => {
            this.searchItem[item[0]] = item[1];
            // Поиск по объявлениям и отобразить результат если есть хотя бы один item
            var goSearch = false;
            this.searchService.termsLength = 0;
            for (var i = 0; i < Object.keys(this.searchItem).length; i++) {
                if (this.searchItem[Object.keys(this.searchItem)[i]]) {
                    this.searchService.termsLength++;
                    goSearch = true;
                }
            }
            if (goSearch) {
                // Поиск по объекту с не пустыми значениями
                this.getAds.tmp = this.searchService.search(this.getAds.allCases, this.searchItem);
            } else {
                // Отобразить все объявы без поисковых запросов
                this.getAds.tmp = this.getAds.allCases;
                this.getAds.tmp = this.searchService.removePriority(this.getAds.allCases, 'pr_searchTerms');
            }
        });
    }

    ngOnInit() {
        this.adsList.getAds.GetShowCases('', false);
        this.getAds.detailClass = false;
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value).trim() && (value).trim() != '') {
            this.searchTimeout = null;
            this.searchService.setSearchItem('case_name', value.trim());
        }

        if (input) {
            input.value = '';
        }
    }

    remove(term): void {
        this.searchService.removeSearchItem(term);
    }

    sortBy(ev, sortTerm) {
        if (ev.checked === true) {
            this.getAds.tmp = this.searchService.sortBy(this.getAds.tmp, sortTerm);
        } else {
            this.getAds.tmp = this.searchService.removePriority(this.getAds.tmp, sortTerm);
        }
    }

    ngOnDestroy() {
        this.subscription_item.unsubscribe();
    }
}
