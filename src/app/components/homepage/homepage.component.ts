import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatChipInputEvent } from '@angular/material';

import { Subscription } from 'rxjs';

import { GetAdsService } from 'src/app/services/get-ads.service';
import { CaseStorageService } from 'src/app/services/case-storage.service';
import { SearchCasesService } from 'src/app/services/search-cases.service';
import { AreasService } from 'src/app/services/areas.service';

import { AppComponent } from 'src/app/app.component';
import { AdsListComponent } from 'src/app/components/ads-list/ads-list.component';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, OnDestroy {

    contentHeader = '';
    searchTimeout = null;
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
        private areasService: AreasService
    ) {
        this.app.contentHeader = ' ';
        this.titleService.setTitle('"Dereban.ua" купи, продай, катай');
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
                // Отобразить все объявы, как и было
                this.getAds.tmp = this.removePriority(this.getAds.allCases);
            }
        });
    }

    ngOnInit() {
        this.adsList.getAds.GetShowCases('', false);
        this.getAds.detailClass = false;
    }

    removePriority(showcases) {
        var equalShowcases = showcases;
        for (let i = 0; i < equalShowcases.length; i++) {
            equalShowcases[i].priority = null;
        }
        return equalShowcases;
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

    sortByArea(ev) {
        if (ev.checked === true) {
          console.log(this.areasService.getNearbyAreas('Николаевская область'));
        } else {
          // Nothing
        }
      }

    ngOnDestroy() {
        this.subscription_item.unsubscribe();
    }
}
