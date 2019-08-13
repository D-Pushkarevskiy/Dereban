import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { SnackbarService } from 'src/app/services/snackbar.service';

import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-refresh-password',
  templateUrl: './modal.html',
  styleUrls: ['./modal.css']
})
export class RefreshPasswordModalComponent implements OnInit {

  form: FormGroup;
  API_URL: String = this.app.API_URL;

  constructor(
    public app: AppComponent,
    private http: HttpClient,
    private snackbar: SnackbarService,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      user: new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
      })
    });
  }

  refreshPasswordRequest() {
    this.http.get(this.API_URL + '?func=refresh_password_request&email=' + this.form.get('user.email').value).subscribe(response => {
      let tmp = response;
      if (tmp['code'] === 2) {
        this.snackbar.show_message(tmp['text']);
      } else if (tmp['code'] === 1) {
        //Вывести текст ошибки
        this.snackbar.show_message(tmp['text']);
      }
    });
  }

  backToLogin() {
    document.getElementById('btn-login').click();
  }

}
