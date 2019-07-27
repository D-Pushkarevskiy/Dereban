import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { Http } from "@angular/http";

import { Observable, Subject } from 'rxjs';

@Injectable()

export class AuthService {
    API_URL = 'http://derebanapi/';
    authToken = localStorage.getItem('authToken');

    constructor(
        private router: Router,
        private http: Http,
    ) { }

    private subject = new Subject<any>();

    logIn() {
        if (this.authToken && this.authToken != '') {
            this.subject.next({ value: true });
        }
    }

    logOut() {
        this.subject.next({ value: false });
        //Удаление токена с базы данных
        this.removeAuthToken();
        localStorage.removeItem('authToken');
        // this.router.navigate(['/']);
    }

    getState(): Observable<any> {
        return this.subject.asObservable();
    }

    getAuthorizationToken() {
        return this.authToken;
    }

    removeAuthToken() {
        if (!this.authToken) {
            return;
        };
        this.http.get(this.API_URL + '?func=remove_auth_token&authToken=' + this.authToken).subscribe(response => {
            var tmp;
            tmp = response.json();

            if (tmp['code'] == 0) {
                //Все ок
            } else if (tmp['code'] == 1) {
                //Ошибка удаления
            }
        });
    }

}