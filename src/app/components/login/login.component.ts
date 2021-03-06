import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { GetAdsService } from 'src/app/services/get-ads.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { AppComponent } from 'src/app/app.component';
import { RefreshPasswordModalComponent } from 'src/app/components/refresh-password/modal/modal';

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
    passwordWrong: Boolean = false;

    constructor(
        public app: AppComponent,
        private http: HttpClient,
        private snackbar: SnackbarService,
        private headerRef: MatDialogRef<HeaderComponent>,
        private refreshPassRef: MatDialog,
        private authService: AuthService,
        private router: Router,
        public getAds: GetAdsService,
    ) {
        this.form = new FormGroup({
            user: new FormGroup({
                email: new FormControl('', [Validators.required, Validators.email]),
                password: new FormControl('', [Validators.required, Validators.minLength(this.charsCount), Validators.pattern('^[a-zA-Z0-9]+$')]),
                recaptcha: new FormControl({ disabled: true, value: null }, Validators.required)
            })
        });
    }

    ngOnInit() {
    }

    Auth() {
        this.http.get(this.API_URL + '?func=auth&login=' + this.form.get('user.email').value + '&password=' + this.form.get('user.password').value).subscribe(response => {
            this.password_error = '';
            let tmp = response;

            if (tmp['code'] === 0) {
                //Все хорошо, авторизировать пользователя, закрыть модалку
                this.authService.setAuthToken(tmp['text']);
                this.authService.logIn();
                this.headerRef.close();
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
                this.headerRef.close();
                this.router.navigate(['/confirm-registration/' + tmp['text']]);
                // this.snackbar.show_message(tmp['text']);
            } else if (tmp['code'] === 3) {
                //Вывести текст с ошибкой корректности пароля
                this.password_error = tmp['text'];
                this.snackbar.show_message(tmp['text']);
            } else if (tmp['code'] === 4) {
                // Вывести рекапчу, неудачных попыток входа было 5
                this.passwordWrong = true;
                this.form.get('user.recaptcha').enable();
                this.snackbar.show_message(tmp['text']);
            }

        });
    }

    openEmailDialog() {
        // Close current dialog
        this.headerRef.close();
        // Open refresh component
        this.refreshPassRef.open(RefreshPasswordModalComponent, {
            width: '500px'
        });
    }

    Clear_text_errors() {
        this.password_error = '';
    }

}
