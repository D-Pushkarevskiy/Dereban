import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';

import { SnackbarService } from 'src/app/services/snackbar.service'
import { GetAdsService } from 'src/app/services/getAds.service';

import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-adding-ad',
  templateUrl: './adding-ad.component.html',
  styleUrls: ['./adding-ad.component.scss']
})
export class AddingAdComponent implements OnInit, OnDestroy {

  private form: FormGroup;
  private subscription: Subscription;
  private subscription_id: Subscription;
  private id: number = 0;
  private case: any;
  private desc_template: string = '';
  private show_desc: Boolean = false;
  private desc_num: Number;
  private desc_full_num: Number;
  private files: any;
  private img_showcase_main: string = '../assets/users_images/user_ads_image_default.jpg';
  private img_name: string = '';

  private templateFullComplete: string;
  private templateFullСustom: string;
  private templateParts: string;
  private templateDetail: string;
  private descr_addition: string;

  private isHiddenFull = true;
  private isHiddenDetail = true;

  public API_URL = this.app.API_URL;
  private code_one_errors = '';
  private success_adding = '';
  private file_path = '';

  constructor(
    private app: AppComponent,
    private titleService: Title,
    private http: HttpClient,
    private snackbar: SnackbarService,
    private router: Router,
    private translate: TranslateService,
    private activateRoute: ActivatedRoute,
    public getAds: GetAdsService
  ) {
    this.subscription_id = activateRoute.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.http.get(this.API_URL + '?func=get_case&id=' + this.id
        ).subscribe(response => {
          this.case = response['text'];
          this.form.get('main.photo').disable();
          this.form.patchValue({
            main: {
              name: this.case.case_name,
              price: this.case.price
            },
            options: {
              type: this.case.type,
              fullType: this.case.full_type,
              detailType: this.case.detail_type,
              state: this.case.state,
              wheelSize: this.case.wheel_size,
              veloType: this.case.velo_type,
              direction: this.case.direction

            },
            description: {
              description: this.case.description
            },
            additionalPhotos: {
              addPhotosLink: this.case.additionalPhotos
            }
          });
          this.img_showcase_main = this.case.photo_url;
          this.img_name = this.case.photo_url;
        });
      }
    });
    this.subscription = this.translate.stream(this.id ? 'MAIN.EDITING_SHOWCASE' : 'MAIN.ADDING_SHOWCASE').subscribe((res: string) => {
      app.contentHeader = res;
      this.titleService.setTitle(res);
    });
    this.translate.stream('SHOWCASE.BIKE.DESCRIPTION.TEMPLATE.COMPLETE').subscribe((res: string) => {
      this.templateFullComplete = res;
      this.ToggleDescTeplate({ checked: this.show_desc });
    });
    this.translate.stream('SHOWCASE.BIKE.DESCRIPTION.TEMPLATE.CUSTOM').subscribe((res: string) => {
      this.templateFullСustom = res;
      this.ToggleDescTeplate({ checked: this.show_desc });
    });
    this.translate.stream('SHOWCASE.BIKE.DESCRIPTION.TEMPLATE.COMPONENTS').subscribe((res: string) => {
      this.templateParts = res;
      this.ToggleDescTeplate({ checked: this.show_desc });
    });
    this.translate.stream('SHOWCASE.BIKE.DESCRIPTION.TEMPLATE.COMPONENT').subscribe((res: string) => {
      this.templateDetail = res;
      this.ToggleDescTeplate({ checked: this.show_desc });
    });
    this.translate.stream('SHOWCASE.BIKE.DESCRIPTION.TEMPLATE.ADDITIONAL').subscribe((res: string) => {
      this.descr_addition = res;
      this.ToggleDescTeplate({ checked: this.show_desc });
    });
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
    this.form.get('main.photo').enable();
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

      formData.append('data', JSON.stringify(this.form.getRawValue()));

      finalData = formData;
    } else {
      finalData = JSON.stringify(this.form.getRawValue());
    }

    this.http.post(this.API_URL + '?func=save_showcase_photo', finalData
    ).subscribe(response => {
      var tmp;
      tmp = response;
      this.code_one_errors = '';
      this.file_path = '';
      var photo_url_for_db = this.case.photo_url.replace('../assets/users_images/showcase_photos/','');

      if (tmp['code'] == 0) {
        //Все ок
        this.file_path = tmp['text'] != '' ? tmp['text'] : photo_url_for_db;

        const update_params = this.id ? '&edit=true&id=' + this.id : '';
        this.http.post(this.API_URL + '?func=save_showcase&file_path=' + this.file_path + update_params, this.form.getRawValue()
        ).subscribe(response => {
          var tmp;
          tmp = response;
          this.code_one_errors = '';
          this.success_adding = '';

          if (tmp['code'] == 0) {
            //Все ок, выводим текст удачного сохранения данных
            this.success_adding = tmp['text'];
            this.snackbar.show_message(this.success_adding);
            this.router.navigate(['/']);
          } else if (tmp['code'] == 1) {
            //Выводим ошибку
            this.code_one_errors = tmp['text'];
            this.snackbar.show_message(this.code_one_errors);
          }
        });
      } else if (tmp['code'] == 1) {
        //Выводим ошибку
        this.code_one_errors = tmp['text'];
        this.snackbar.show_message(this.code_one_errors);
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription_id.unsubscribe();
  }
}
