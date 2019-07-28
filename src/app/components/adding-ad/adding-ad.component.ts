import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { RequestOptions } from '@angular/http';
import { Router } from '@angular/router';

import { AppComponent } from 'src/app/app.component';

@Component({
    selector: 'app-adding-ad',
    templateUrl: './adding-ad.component.html',
    styleUrls: ['./adding-ad.component.css']
})
export class AddingAdComponent implements OnInit {

    contentHeader = 'Добавить объявление';
    form: FormGroup;
    desc_template = '';
    show_desc = false;
    desc_num;
    desc_full_num;
    files: any;
    img_showcase_main = '../assets/users_images/user_ads_image_default.jpg';
    img_name = '';

    templateFullComplete = 'Год выпуска: \n\Номер рамы: \n\Размер рамы: \n\ \n\Ссылка на сайт производителя: \n\Ссылка на геометрию: ';
    templateFullСustom = 'Год выпуска: \n\Номер рамы: \n\Размер рамы: \n\ \n\Рама: \n\(задний амортизатор): \n\Вилка: \n\Рулевая: \n\Подседельный штырь: \n\Подседельный зажим: \n\Седло: \n\Каретка: \n\Шатуны: \n\Звезд(а)ы: \n\Педали: \n\Цепь: \n\ \n\Колеса\n\ Переднее\n\   Втулка: \n\   Спицы: \n\   Обод: \n\   Покрышка: \n\ Заднее\n\   Втулка: \n\   Спицы: \n\   Обод: \n\   Покрышка: \n\ \n\Тормоза: \n\Роторы: \n\Переключатели: \n\Руль: \n\Вынос: \n\Грипсы: \n\ \n\Вес в сборе: ';
    templateParts = 'Рама: \n\(задний амортизатор): \n\Вилка: \n\Рулевая: \n\Подседельный штырь: \n\Подседельный зажим: \n\Седло: \n\Каретка: \n\Шатуны: \n\Звезд(а)ы: \n\Педали: \n\Цепь: \n\ \n\Колеса\n\ Переднее\n\   Втулка: \n\   Спицы: \n\   Обод: \n\   Покрышка: \n\ Заднее\n\   Втулка: \n\   Спицы: \n\   Обод: \n\   Покрышка: \n\ \n\Тормоза: \n\Роторы: \n\Переключатели: \n\Руль: \n\Вынос: \n\Грипсы: ';
    templateDetail = 'Фирма: \n\Модель: \n\Параметры: \n\Вес: ';
    descr_addition = '\n\ \n\Дополнительная информация: \n\  ';

    isHiddenFull = true;
    isHiddenDetail = true;

    API_URL = this.app.API_URL;
    authToken = localStorage.getItem('authToken');
    code_one_errors = '';
    success_adding = '';
    file_path = '';

    constructor(
        private app: AppComponent,
        private titleService: Title,
        private http: HttpClient,
        public snackBar: MatSnackBar,
        private router: Router
    ) {
        app.contentHeader = this.contentHeader;
        this.titleService.setTitle(this.contentHeader);
    }

    ngOnInit() {
        this.form = new FormGroup({
            main: new FormGroup({
                photo: new FormControl('', [Validators.required]),
                name: new FormControl('', [Validators.required]),
                price: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')])
            }),
            options: new FormGroup({
                type: new FormControl(),
                fullType: new FormControl(),
                detailType: new FormControl(),
                state: new FormControl(),
                wheelSize: new FormControl(),
                veloType: new FormControl(),
                direction: new FormControl()

            }),
            description: new FormGroup({
                description: new FormControl()
            }),
            additionalPhotos: new FormGroup({
                addPhotosLink: new FormControl()
            })
        });
    }

    UploadPhoto() {
        document.getElementById('input_file_photo').click();
    }

    fileChange(event) {
        let target = event.target || event.srcElement;
        this.img_name = target.value;
        this.files = target.files;
    }

    AddShowCase() {
        let finalData;

        if (this.files) {
            let files: FileList = this.files;
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('photo', files[i]);
            }

            const options = new RequestOptions({ params: this.form.getRawValue() });
            formData.append('data', JSON.stringify(options));

            finalData = formData;

        } else {
            finalData = this.form;
        }

        this.http.post(this.API_URL + '?func=save_showcase_photo&authToken=' + this.authToken, finalData
        ).subscribe(response => {
            var tmp;
            tmp = response;
            this.code_one_errors = '';
            this.file_path = '';

            if (tmp['code'] == 0) {
                //Все ок
                if (tmp['text'] == '') {
                    this.Snackbar_message('Ошибка записи файла');
                } else {
                    this.file_path = tmp['text'];

                    const options = new RequestOptions({ params: this.form.getRawValue() });

                    this.http.get(this.API_URL + '?func=save_showcase&authToken=' + this.authToken + '&file_path=' + this.file_path, options
                    ).subscribe(response => {
                        var tmp;
                        tmp = response;
                        this.code_one_errors = '';
                        this.success_adding = '';

                        if (tmp['code'] == 0) {
                            //Все ок, выводим текст удачного сохранения данных
                            this.success_adding = tmp['text'];
                            this.Snackbar_message(this.success_adding);
                            this.router.navigate(['/']);
                        } else if (tmp['code'] == 1) {
                            //Выводим ошибку
                            this.code_one_errors = tmp['text'];
                            this.Snackbar_message(this.code_one_errors);
                        }
                    });
                }
            } else if (tmp['code'] == 1) {
                //Выводим ошибку
                this.code_one_errors = tmp['text'];
                this.Snackbar_message(this.code_one_errors);
            }
        });
    }

    ToggleDescTeplate(ev) {
        if (ev.checked === false) {
            this.desc_template = '';
            this.show_desc = false;
        } else {
            this.show_desc = true;
            if (this.desc_num == 1) {
                this.desc_template = this.templateFullСustom + this.descr_addition;
            } else if (this.desc_num == 2) {
                this.desc_template = this.templateParts + this.descr_addition;
            } else if (this.desc_num == 3) {
                this.desc_template = this.templateDetail + this.descr_addition;
            } else if (this.desc_num == 4) {
                this.desc_template = this.templateFullComplete + this.descr_addition;
            } else if (this.desc_num == 5) {
                this.desc_template = this.templateFullСustom + this.descr_addition;
            }
        }
    }

    ChangeDescText(ev) {
        if (this.show_desc == true) {
            this.isHiddenFull = true;
            this.isHiddenDetail = true;
            if (ev == 1) {
                this.isHiddenFull = false;
                if (this.desc_full_num == 1) {
                    this.desc_num = 4;
                    this.desc_template = this.templateFullComplete + this.descr_addition;
                } else if (this.desc_full_num == 2) {
                    this.desc_num = 5;
                    this.desc_template = this.templateFullСustom + this.descr_addition;
                } else {
                    this.desc_num = 1;
                    this.desc_template = this.templateFullСustom + this.descr_addition;
                }
            } else if (ev == 2) {
                this.desc_template = this.templateParts + this.descr_addition;
                this.desc_num = 2;
            } else if (ev == 3) {
                this.isHiddenDetail = false;
                this.desc_template = this.templateDetail + this.descr_addition;
                this.desc_num = 3;
            }
        } else {
            this.desc_template = '';
            this.isHiddenFull = true;
            this.isHiddenDetail = true;
            if (ev == 1) {
                this.isHiddenFull = false;
                if (this.desc_full_num == 1) {
                    this.desc_num = 4;
                } else if (this.desc_full_num == 2) {
                    this.desc_num = 5;
                } else {
                    this.desc_num = 1;
                }
            } else if (ev == 2) {
                this.desc_num = 2;
            } else if (ev == 3) {
                this.isHiddenDetail = false;
                this.desc_num = 3;
            }
        }
    }

    ChangeFullDescText(ev) {
        if (this.show_desc == true) {
            if (ev == 1) {
                this.desc_full_num = 1;
                this.desc_num = 4;
                this.desc_template = this.templateFullComplete + this.descr_addition;
            } else if (ev == 2) {
                this.desc_full_num = 2;
                this.desc_num = 5;
                this.desc_template = this.templateFullСustom + this.descr_addition;
            }
        } else {
            if (ev == 1) {
                this.desc_full_num = 1;
                this.desc_num = 4;
            } else if (ev == 2) {
                this.desc_full_num = 2;
                this.desc_num = 5;
            }
        }
    }

    Snackbar_message(msg_text) {
        if (msg_text != '') {
            let snackBarRef = this.snackBar.open(msg_text, '', {
                duration: 3000,
            });
        }
    }

}
