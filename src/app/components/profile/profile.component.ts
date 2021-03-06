import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { SnackbarService } from 'src/app/services/snackbar.service';
import { ProfileService } from 'src/app/services/profile.service';
import { AreasService } from 'src/app/services/areas.service';
import { AppTitleService } from 'src/app/services/app-title.service';

import { AppComponent } from 'src/app/app.component';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    contentHeader = 'MAIN.PROFILE';
    form: FormGroup;
    areas: string[] = this.areasService.getAreas();
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
        private titleService: Title,
        private areasService: AreasService,
        private appTitleService: AppTitleService
    ) {
        app.contentHeader = this.contentHeader;
        this.titleService.setTitle(this.contentHeader);
        this.appTitleService.setAppTitle(this.contentHeader);
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
        let formData = {
            user: {
                name: this.form.get('user.name').value,
                surname: this.form.get('user.surname').value
            },
            contacts: {
                phone: this.form.get('contacts.phone').value,
                phone2: this.form.get('contacts.phone2').value,
                area: this.form.get('contacts.area').value
            },
            social: {
                telegram: this.form.get('social.telegram').value,
                vk: this.form.get('social.vk').value,
                facebook: this.form.get('social.facebook').value,
                instagram: this.form.get('social.instagram').value
            }
        }

        this.http.get(this.API_URL + '?func=add_user_info'
            + '&user=' + JSON.stringify(formData.user)
            + '&contacts=' + JSON.stringify(formData.contacts)
            + '&social=' + JSON.stringify(formData.social)
        ).subscribe(response => {
            var tmp;
            tmp = response;
            this.code_one_errors = '';
            this.success_saving = '';

            if (tmp['code'] == 0) {
                // Все ок, выводим текст удачного сохранения данных
                this.success_saving = tmp['text'];
                this.snackbar.show_message(this.success_saving);
                // Передаем имя пользователя в хедер
                this.profileService.setName(this.form.controls.user.get('name').value);
            } else if (tmp['code'] == 1) {
                // Выводим ошибку
                this.code_one_errors = tmp['text'];
                console.log(this.code_one_errors);
                this.snackbar.show_message(this.code_one_errors);
            }
        });
    }

    GetUserInfo() {
        this.http.get(this.API_URL + '?func=get_user_info'
        ).subscribe(response => {
            var tmp;
            tmp = response;

            this.photoName = tmp['photo'] ? tmp['photo'] : this.photoName;
            this.form.controls.user.setValue({ 'name': tmp['name'], 'surname': tmp['surname'] });
            this.form.controls.contacts.setValue({ 'phone': tmp['phone'], 'phone2': tmp['phone2'], 'area': tmp['area'] });
            this.form.controls.social.setValue({ 'telegram': tmp['telegram'], 'vk': tmp['vk'], 'facebook': tmp['facebook'], 'instagram': tmp['instagram'] });
        });
    }

}
