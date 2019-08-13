import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AuthService } from 'src/app/services/auth.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

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
    API_URL = this.app.API_URL;
    regToken = '';

    constructor(
        private app: AppComponent,
        private http: HttpClient,
        private authService: AuthService,
        private activateRoute: ActivatedRoute,
        private router: Router,
        private titleService: Title,
        private snackbar: SnackbarService
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
        this.http.get(this.API_URL + '?func=conf_register&password=' + this.form.get('user.password').value + '&regToken=' + this.regToken).subscribe(response => {
            var tmp;
            tmp = response;
            this.password_error = '';
            this.code_one_errors = '';
            if (tmp['code'] === 0) {
                //На главную страницу
                this.router.navigate(['/']);
                //Все ок, оповещаем пользователя о успешном подтверждении регистрации
                this.code_one_errors = tmp['text'];
                this.snackbar.show_message(this.code_one_errors);
            } else if (tmp['code'] === 1) {
                //Вывести текст ошибки
                this.code_one_errors = tmp['text'];
                this.snackbar.show_message(this.code_one_errors);
            } else if (tmp['code'] === 3) {
                //Вывести текст с ошибкой некорректности пароля
                this.password_error = tmp['text'];
            }
        });
    }

    Clear_text_errors() {
        this.password_error = '';
    }

}
