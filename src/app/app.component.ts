import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { LangService } from './services/lang.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    contentHeader = '';
    overlay = false;
    public API_URL = 'http://derebanapi/';

    constructor(
        public translate: TranslateService,
        public langService: LangService
        ) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('ua');

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        translate.use(langService.getTranslateLang() ? langService.getTranslateLang() : 'ua');
    }

    ngOnInit() { }

}
