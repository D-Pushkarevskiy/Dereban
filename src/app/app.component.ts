import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    contentHeader = '';
    overlay = false;
    authToken = this.authService.getAuthorizationToken();
    public API_URL = 'http://derebanapi/';

    constructor(
        private authService: AuthService,
    ) {
    }

    ngOnInit() {
        this.isLogIn();
    }

    isLogIn() {
        if (this.authToken && this.authToken != '') {
            this.authService.logIn();
            return true;
        } else {
            this.authService.logOut();
            return false;
        }
    }
}
