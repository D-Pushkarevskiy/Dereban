import {Component, OnInit} from '@angular/core';
import {AppComponent} from 'src/app/app.component';
import {FormGroup} from '@angular/forms';
import {Validators} from '@angular/forms';
import {Http} from '@angular/http';
import {MatSnackBar} from '@angular/material';
import {FormControl} from '@angular/forms';
import {RequestOptions} from '@angular/http';
import {Observable, Subject} from 'rxjs';
import {ProfileService} from 'src/app/shared/profile.service';
import {Title} from '@angular/platform-browser';

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
    authToken = localStorage.getItem('authToken');
    show = false;
    numCount = 9;
    code_one_errors = '';
    success_saving = '';
    success_saving_photo = '';
    files: any;
    photoUrl = '../assets/users_images/user_profile_image_default.jpg';

    name = '';
    surname = '';
    phone = '';
    phone2 = '';
    area = '';
    telegram = '';
    vk = '';
    facebook = '';
    instagram = '';

    constructor(
        private app: AppComponent,
        private http: Http,
        public snackBar: MatSnackBar,
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
        this.GetUserPhoto();
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

        this.http.post(this.API_URL + '?func=set_user_photo&authToken=' + this.authToken, finalData
        ).subscribe(response => {
            var tmp;
            tmp = response.json();
            this.code_one_errors = '';
            this.success_saving_photo = '';

            if (tmp['code'] == 0) {
                //Все ок, выводим текст удачного сохранения данных
                this.success_saving_photo = tmp['text'];
                this.Snackbar_message(this.success_saving_photo);
            } else if (tmp['code'] == 1) {
                //Выводим ошибку
                this.code_one_errors = tmp['text'];
                this.Snackbar_message(this.code_one_errors);
            }
        });
    }

    SaveUserInfo() {

        this.show = true;
        const options = new RequestOptions({params: this.form.getRawValue()});

        this.http.get(this.API_URL + '?func=add_user_info&authToken=' + this.authToken, options
        ).subscribe(response => {
            this.show = false;
            var tmp;
            tmp = response.json();
            this.code_one_errors = '';
            this.success_saving = '';

            if (tmp['code'] == 0) {
                //Все ок, выводим текст удачного сохранения данных
                this.success_saving = tmp['text'];
                this.Snackbar_message(this.success_saving);
                //Передаем имя пользователя в хедер
                this.profileService.setName(this.form.controls.user.get('name').value);
            } else if (tmp['code'] == 1) {
                //Выводим ошибку
                this.code_one_errors = tmp['text'];
                this.Snackbar_message(this.code_one_errors);
            }
        });
    }

    GetUserInfo() {
        this.show = true;
        this.http.get(this.API_URL + '?func=get_user_info&authToken=' + this.authToken
        ).subscribe(response => {
            this.show = false;
            var tmp;
            tmp = response.json();

            this.form.controls.user.setValue({'name': tmp['name'], 'surname': tmp['surname']});
            this.form.controls.contacts.setValue({'phone': tmp['phone'], 'phone2': tmp['phone2'], 'area': tmp['area']});
            this.form.controls.social.setValue({'telegram': tmp['telegram'], 'vk': tmp['vk'], 'facebook': tmp['facebook'], 'instagram': tmp['instagram']});
        });
    }

    GetUserPhoto() {
        this.show = true;
        this.http.get(this.API_URL + '?func=get_user_photo&authToken=' + this.authToken
        ).subscribe(response => {
            this.show = false;
            var tmp;
            tmp = response.json();

            if (tmp['code'] == 0) {
                //Все ок, принимаем урл фотографии
                this.photoUrl = tmp['text'];
            } else if (tmp['code'] == 1) {
                //Выводим ошибку
                this.code_one_errors = tmp['text'];
                this.Snackbar_message(this.code_one_errors);
            }
        });
    }

    Snackbar_message(msg_text) {
        if (msg_text != '') {
            let snackBarRef = this.snackBar.open(msg_text, '', {
                duration: 3000,
            });
        }
    }
}
