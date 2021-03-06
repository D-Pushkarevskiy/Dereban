import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { MatChipInputEvent } from '@angular/material';

import { Subscription } from 'rxjs';

import { GetAdsService } from 'src/app/services/get-ads.service';
import { CaseStorageService } from 'src/app/services/case-storage.service';
import { SearchCasesService } from 'src/app/services/search-cases.service';
import { AuthService } from 'src/app/services/auth.service';
import { AreasService } from 'src/app/services/areas.service';
import { AppTitleService } from 'src/app/services/app-title.service';

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
    areas: string[] = this.areasService.getAreas();
    subscription: Subscription;
    subscription_min_price: Subscription;
    subscription_max_price: Subscription;
    foundCases: Array<any> = [];
    subscription_item: Subscription;
    filterTimer;
    minValue = 0;
    maxValue = 999999;
    selectedArea: string;
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
        private authService: AuthService,
        private areasService: AreasService,
        private appTitleService: AppTitleService,
        private translateService: TranslateService
    ) {
        // Cear content Title/Header name
        this.app.contentHeader = ' ';
        // Set default page title
        this.titleService.setTitle(this.translateService.instant('MAIN.DEREBAN'));
        this.appTitleService.setAppTitle('MAIN.DEREBAN');
        this.subscription = this.authService.getState().subscribe(state => {
            this.isAuth = state.value;
        });
        this.subscription_min_price = this.getAds.getMinPrice().subscribe(price => {
            this.minValue = price.value;
        });
        this.subscription_max_price = this.getAds.getMaxPrice().subscribe(price => {
            this.maxValue = price.value;
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
        this.getAds.myShowcasesState = false;
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

    filterByPrice() {
        var __this = this;
        clearTimeout(this.filterTimer);
        this.filterTimer = setTimeout(function () {
            __this.getAds.tmp = __this.searchService.filterByPrice(__this.getAds.allCases, __this.minValue, __this.maxValue);
        }, 500);
    }

    clearValue(type) {
        if (type === 'min') {
            this.minValue = null;
        } else if (type === 'max') {
            this.maxValue = null;
        }

        this.filterByPrice();
    }

    filterByArea() {
        this.getAds.tmp = this.searchService.filterByArea(this.getAds.tmp, this.selectedArea);
    }

    ngOnDestroy() {
        this.subscription_item.unsubscribe();
    }
}
