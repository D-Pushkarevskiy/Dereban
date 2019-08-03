import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class AuthService {
    API_URL: String = 'http://derebanapi/';

    constructor(
        private http: HttpClient,
    ) { }

    private subject = new Subject<any>();

    public logIn() {
        this.subject.next({ value: true });
    }

    public logOut() {
        this.subject.next({ value: false });
    }

    public getState(): Observable<any> {
        return this.subject.asObservable();
    }

    public setAuthToken(token) {
        localStorage.setItem('authToken', token);
    }

    public getAuthToken() {
        return localStorage.getItem('authToken');
    }

    public removeAuthToken() {
        //Удаление токена с базы данных
        this.removeAuthTokenFromDb();
        localStorage.removeItem('authToken');
    }

    public removeAuthTokenFromDb() {
        if (!this.getAuthToken()) {
            return;
        };
        this.http.get(this.API_URL + '?func=remove_auth_token').subscribe(response => {
            var tmp;
            tmp = response;

            if (tmp['code'] == 0) {
                //Все ок
            } else if (tmp['code'] == 1) {
                //Ошибка удаления
            }
        });
    }

}