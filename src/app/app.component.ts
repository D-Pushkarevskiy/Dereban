import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {AuthService} from 'src/app/shared/auth.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    contentHeader = '';
    overlay = false;
    public authToken = localStorage.getItem('authToken');
    public API_URL = 'http://localhost/Dereban_api/';
    
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
