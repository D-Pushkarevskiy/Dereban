import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    contentHeader = '';
    overlay = false;
    public API_URL = 'http://derebanapi/';

    constructor() {
    }

    ngOnInit() {
    }
}
