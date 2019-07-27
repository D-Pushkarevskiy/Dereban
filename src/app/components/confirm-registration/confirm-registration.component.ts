import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';

import { AuthService } from 'src/app/services/auth.service';

import { AppComponent } from 'src/app/app.component';

@Component({
    selector: 'app-confirm-registration',
    templateUrl: './confirm-registration.component.html',
    styleUrls: ['./confirm-registration.component.css']
})
export class ConfirmRegistrationComponent implements OnInit {
    charsCount = 8;
    form: FormGroup;
    contentHeader = 'Подтверждение пароля';
    password_error = '';
    code_one_errors = '';
    API_URL = 'http://derebanapi/';
    regToken = '';
    show = false;

    constructor(
        private app: AppComponent,
        private http: Http,
        private authService: AuthService,
        private activateRoute: ActivatedRoute,
        private router: Router,
        public snackBar: MatSnackBar,
        private titleService: Title
    ) {
        app.contentHeader = this.contentHeader;
        this.titleService.setTitle(this.contentHeader);
        this.regToken = activateRoute.snapshot.params['regToken'];
    }

    ngOnInit() {
        this.form = new FormGroup({
            user: new FormGroup({
                password: new FormControl('', [Validators.required, Validators.minLength(this.charsCount)])
            })
        });
    }

    ConfirmRegistration() {
        this.show = true;
        this.http.get(this.API_URL + '?func=conf_register&password=' + this.form.get('user.password').value + '&regToken=' + this.regToken).subscribe(response => {
            this.show = false;
            var tmp;
            tmp = response.json();
            this.password_error = '';
            this.code_one_errors = '';
            if (tmp['code'] === 0) {
                //На страницу личного кабинета
                this.router.navigate(['/']);
                //Все ок, оповещаем пользователя о успешном подтверждении регистрации
                this.code_one_errors = tmp['text'];
                this.Snackbar_message(this.code_one_errors);
            } else if (tmp['code'] === 1) {
                //Вывести текст ошибки
                this.code_one_errors = tmp['text'];
                this.Snackbar_message(this.code_one_errors);
            } else if (tmp['code'] === 3) {
                //Вывести текст с ошибкой некорректности пароля
                this.password_error = tmp['text'];
            }
        });
    }

    Clear_text_errors() {
        this.password_error = '';
    }

    Snackbar_message(msg_text) {
        if (msg_text != '') {
            let snackBarRef = this.snackBar.open(msg_text, '', {
                duration: 6000,
            });
        }
    }

}
