import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { AppComponent } from 'src/app/app.component';

import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-refresh-password',
  templateUrl: './refresh-password.component.html',
  styleUrls: ['./refresh-password.component.css']
})
export class RefreshPasswordComponent implements OnInit {
  contentHeader = 'Сброс пароля';
  API_URL = this.app.API_URL;
  token: string;
  form: FormGroup;
  charsCount = 8;
  password_error = '';

  constructor(
    private app: AppComponent,
    private http: HttpClient,
    private activateRoute: ActivatedRoute,
    private titleService: Title,
    private router: Router,
    private snackbar: SnackbarService
  ) {
    app.contentHeader = this.contentHeader;
    this.titleService.setTitle(this.contentHeader);
    this.token = activateRoute.snapshot.params['token'];
  }

  ngOnInit() {
    this.form = new FormGroup({
      password: new FormGroup({
        current: new FormControl('', [Validators.required, Validators.minLength(this.charsCount), Validators.pattern('^[a-zA-Z0-9]+$')]),
        new: new FormControl('', [Validators.required, Validators.minLength(this.charsCount), Validators.pattern('^[a-zA-Z0-9]+$')])
      })
    });
  }

  refreshPassword() {
    this.http.get(this.API_URL + '?func=refresh_password&current=' + this.form.get('password.current').value + '&new=' + this.form.get('password.new').value + '&token=' + this.token).subscribe(response => {
      if (response['code'] === 0) {
        //На главную страницу
        this.router.navigate(['/']);
        //Все ок, оповещаем пользователя о успешном сбросе пароля
        this.snackbar.show_message(response['text']);
      } else if (response['code'] === 2 || response['code'] === 1) {
        //Вывести текст ошибки
        this.snackbar.show_message(response['text']);
      } else if (response['code'] === 3) {
        //Вывести текст с ошибкой некорректности пароля
        this.password_error = response['text'];
      }
    });
  }

  Clear_text_errors() {
    this.password_error = '';
  }

}
