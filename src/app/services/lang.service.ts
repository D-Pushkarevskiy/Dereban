import { Injectable } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';

@Injectable()

export class LangService {
    constructor(public translate: TranslateService) {}

    setTranslateLang(lang) {
        localStorage.setItem('lang', lang);
    }

    getTranslateLang() {
        return localStorage.getItem('lang') ? localStorage.getItem('lang') : this.translate.getBrowserLang();
    }
}