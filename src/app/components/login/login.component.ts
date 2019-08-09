import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { GetAdsService } from 'src/app/services/getAds.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { AppComponent } from 'src/app/app.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    charsCount: number = 8;
    form: FormGroup;
    API_URL: String = this.app.API_URL;
    password_error: String = '';

    constructor(
        public app: AppComponent,
        private http: HttpClient,
        private snackbar: SnackbarService,
        private dialogRef: MatDialogRef<HeaderComponent>,
        private authService: AuthService,
        private router: Router,
        public getAds: GetAdsService,
    ) { }

    ngOnInit() {
        this.form = new FormGroup({
            user: new FormGroup({
                email: new FormControl('', [Validators.required, Validators.email]),
                password: new FormControl('', [Validators.required, Validators.minLength(this.charsCount), Validators.pattern('^[a-zA-Z0-9]+$')])
            })
        });
    }

    Auth() {
        this.http.get(this.API_URL + '?func=auth&login=' + this.form.get('user.email').value + '&password=' + this.form.get('user.password').value).subscribe(response => {
            var tmp;
            this.password_error = '';
            tmp = response;

            if (tmp['code'] === 0) {
                //Все хорошо, авторизировать пользователя, закрыть модалку
                this.authService.setAuthToken(tmp['text']);
                this.authService.logIn();
                this.dialogRef.close();
                this.getAds.GetActiveFavorite();
                this.getAds.GetActiveRating();
                //Если авторизован пользователь первый раз перекинуть на страницу контактов
                if (tmp['isAuth'] == false) {
                    this.router.navigate(['/profile']);
                }
            } else if (tmp['code'] === 1) {
                //Вывести текст ошибки
                this.snackbar.show_message(tmp['text']);
            } else if (tmp['code'] === 2) {
                //Все хорошо, уведомить пользователя о удачной регистрации и письме, закрыть модалку
                this.dialogRef.close();
                this.snackbar.show_message(tmp['text']);
            }
            else if (tmp['code'] === 3) {
                //Вывести текст с ошибкой корректности пароля
                this.password_error = tmp['text'];
            }
        });
    }

    Clear_text_errors() {
        this.password_error = '';
    }

}
