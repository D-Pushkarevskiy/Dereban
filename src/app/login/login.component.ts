import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormControl} from '@angular/forms';
import {Validators} from '@angular/forms';
import {Http} from '@angular/http';
import {MatSnackBar, MatDialogRef} from '@angular/material';
import {HeaderComponent} from 'src/app/header/header.component';
import {AuthService} from 'src/app/shared/auth.service';
import {Router} from '@angular/router';
import {AppComponent} from 'src/app/app.component';
import {getAdsService} from 'src/app/shared/getAds.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    charsCount = 8;
    form: FormGroup;
    API_URL = this.app.API_URL;
    password_error = '';
    code_one_errors = '';
    success_register = '';
    show = false;

    constructor(
        public app: AppComponent,
        private http: Http,
        public snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<HeaderComponent>,
        private authService: AuthService,
        private router: Router,
        public getAds: getAdsService,
    ) {}

    ngOnInit() {
        this.form = new FormGroup({
            user: new FormGroup({
                email: new FormControl('', [Validators.required, Validators.email]),
                password: new FormControl('', [Validators.required, Validators.minLength(this.charsCount), Validators.pattern('^[a-zA-Z0-9]+$')])
            })
        });
    }

    Auth() {
        this.show = true;
        this.http.get(this.API_URL + '?func=auth&login=' + this.form.get('user.email').value + '&password=' + this.form.get('user.password').value).subscribe(response => {
            this.show = false;
            var tmp;
            this.password_error = '';
            this.code_one_errors = '';
            this.success_register = '';
            tmp = response.json();

            if (tmp['code'] === 0) {
                //Все хорошо, авторизировать пользователя, закрыть модалку
                localStorage.setItem('authToken', tmp['text']);
                this.authService.logIn();
                this.dialogRef.close();
                this.getAds.GetActiveFavorite();
                //Если авторизован пользователь первый раз перекинуть на страницу контактов
                if (tmp['isAuth'] == false) {
                    this.router.navigate(['/profile']);
                }
            } else if (tmp['code'] === 1) {
                //Вывести текст ошибки
                this.code_one_errors = tmp['text'];
                this.Snackbar_message(this.code_one_errors);
            } else if (tmp['code'] === 2) {
                //Все хорошо, уведомить пользователя о удачной регистрации и письме, закрыть модалку
                this.success_register = tmp['text'];
                this.dialogRef.close();
                this.Snackbar_message(this.success_register);
            }
            else if (tmp['code'] === 3) {
                //Вывести текст с ошибкой корректности пароля
                this.password_error = tmp['text'];
            }
        });
    }

    Clear_text_errors() {
        this.password_error = '';
        this.code_one_errors = '';
    }

    Snackbar_message(msg_text) {
        if (msg_text != '') {
            let snackBarRef = this.snackBar.open(msg_text, '', {
                duration: 3000,
            });
        }
    }

}