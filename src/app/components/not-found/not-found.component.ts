import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AppTitleService } from 'src/app/services/app-title.service';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

    contentHeader = 'MAIN.404';

    constructor(
        private titleService: Title,
        private appTitleService: AppTitleService
    ) {
        this.titleService.setTitle(this.contentHeader);
        this.appTitleService.setAppTitle(this.contentHeader);
    }

    ngOnInit() {
    }

}
