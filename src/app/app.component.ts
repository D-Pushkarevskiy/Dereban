import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { LangService } from './services/lang.service';
import { AppTitleService } from './services/app-title.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  contentHeader = '';
  overlay = false;
  public API_URL = 'https://dereban.000webhostapp.com';

  constructor(
    public translate: TranslateService,
    public langService: LangService,
    public titleService: Title,
    public appTitleService: AppTitleService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('ua');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use(langService.getTranslateLang() ? langService.getTranslateLang() : 'ua');

    // Translating app title dynamically
    translate.onLangChange.subscribe((event: LangChangeEvent) => {
      titleService.setTitle(translate.instant(this.appTitleService.getAppTitle() || 'MAIN.DEREBAN'));
    });
  }

  ngOnInit() { }

  onActivate(event: any) {
    if (isPlatformBrowser(this.platformId)) {
      let scrollToTop = window.setInterval(() => {
        let pos = window.pageYOffset;
        if (pos > 0) {
          window.scrollTo(0, pos - 50); // how far to scroll on each step
        } else {
          window.clearInterval(scrollToTop);
        }
      }, 16);
    }
  }

  closeOverlay() {
    let element: HTMLElement = document.getElementsByClassName('zoomed-img')[0] as HTMLElement;
    element.click();
  }

}
