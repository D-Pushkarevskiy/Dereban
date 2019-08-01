import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { SnackbarService } from 'src/app/services/snackbar.service';
import { ProfileService } from 'src/app/services/profile.service';

import { AppComponent } from 'src/app/app.component';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    contentHeader = 'Профиль';
    form: FormGroup;
    areas: string[] = [
        '',
        'Винницкая область',
        'Волынская область',
        'Днепропетровская область',
        'Донецкая область',
        'Житомирская область',
        'Закарпатская область',
        'Запорожская область',
        'Ивано-Франковская область',
        'Киевская область',
        'Кировоградская область',
        'Луганская область',
        'Львовская область',
        'Николаевская область',
        'Одесская область',
        'Полтавская область',
        'Ровенская область',
        'Сумская область',
        'Тернопольская область',
        'Харьковская область',
        'Херсонская область',
        'Хмельницкая область',
        'Черкасская область',
        'Черниговская область',
        'Черновицкая область'
    ];
    API_URL = this.app.API_URL;
    numCount = 9;
    code_one_errors = '';
    success_saving = '';
    success_saving_photo = '';
    files: any;

    photoName: String = 'user_profile_image_default.jpg';
    name: String;
    surname: String;
    phone: Number;
    phone2: Number;
    area: String;
    telegram: String;
    vk: String;
    facebook: String;
    instagram: String;

    constructor(
        private app: AppComponent,
        private http: HttpClient,
        private snackbar: SnackbarService,
        private profileService: ProfileService,
        private titleService: Title
    ) {
        app.contentHeader = this.contentHeader;
        this.titleService.setTitle(this.contentHeader);
    }

    ngOnInit() {
        this.form = new FormGroup({
            user: new FormGroup({
                name: new FormControl('', [Validators.required]),
                surname: new FormControl()
            }),
            contacts: new FormGroup({
                phone: new FormControl('', [Validators.required, Validators.minLength(this.numCount), Validators.maxLength(this.numCount)]),
                phone2: new FormControl('', [Validators.minLength(this.numCount), Validators.maxLength(this.numCount)]),
                area: new FormControl()
            }),
            social: new FormGroup({
                telegram: new FormControl(),
                vk: new FormControl(),
                facebook: new FormControl(),
                instagram: new FormControl()
            })
        });

        this.GetUserInfo();
    }

    UploadPhoto() {
        document.getElementById('input_file_photo').click();
    }

    fileChange(event) {
        let target = event.target || event.srcElement;
        this.files = target.files;

        let finalData;

        if (this.files) {
            let files: FileList = this.files;
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('photo', files[i]);
            }

            finalData = formData;

        } else {
            finalData = this.form;
        }

        this.http.post(this.API_URL + '?func=set_user_photo', finalData
        ).subscribe(response => {
            var tmp;
            tmp = response;
            this.code_one_errors = '';
            this.success_saving_photo = '';

            if (tmp['code'] == 0) {
                //Все ок, выводим текст удачного сохранения данных
                this.success_saving_photo = tmp['text'];
                this.snackbar.show_message(this.success_saving_photo);
            } else if (tmp['code'] == 1) {
                //Выводим ошибку
                this.code_one_errors = tmp['text'];
                this.snackbar.show_message(this.code_one_errors);
            }
        });
    }

    SaveUserInfo() {
        this.http.post(this.API_URL + '?func=add_user_info', this.form.getRawValue()
        ).subscribe(response => {
            var tmp;
            tmp = response;
            this.code_one_errors = '';
            this.success_saving = '';

            if (tmp['code'] == 0) {
                //Все ок, выводим текст удачного сохранения данных
                this.success_saving = tmp['text'];
                this.snackbar.show_message(this.success_saving);
                //Передаем имя пользователя в хедер
                this.profileService.setName(this.form.controls.user.get('name').value);
            } else if (tmp['code'] == 1) {
                //Выводим ошибку
                this.code_one_errors = tmp['text'];
                this.snackbar.show_message(this.code_one_errors);
            }
        });
    }

    GetUserInfo() {
        this.http.get(this.API_URL + '?func=get_user_info'
        ).subscribe(response => {
            var tmp;
            tmp = response;

            this.photoName = tmp['photo'];
            this.form.controls.user.setValue({ 'name': tmp['name'], 'surname': tmp['surname'] });
            this.form.controls.contacts.setValue({ 'phone': tmp['phone'], 'phone2': tmp['phone2'], 'area': tmp['area'] });
            this.form.controls.social.setValue({ 'telegram': tmp['telegram'], 'vk': tmp['vk'], 'facebook': tmp['facebook'], 'instagram': tmp['instagram'] });
        });
    }

}
