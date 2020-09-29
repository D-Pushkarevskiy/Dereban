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
import { GetAdsService } from 'src/app/services/get-ads.service';
import { AppTitleService } from 'src/app/services/app-title.service';
import { DraftShowcaseService } from 'src/app/services/draft-showcase.service';

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

  private case_types = [];
  private case_full_types = [];
  private parts = [];
  private case_states = [];
  private wheelSizes = [];
  private bike_types = [];
  private bike_directions = [];

  constructor(
    private app: AppComponent,
    private titleService: Title,
    private http: HttpClient,
    private snackbar: SnackbarService,
    private router: Router,
    private translate: TranslateService,
    private activateRoute: ActivatedRoute,
    public getAds: GetAdsService,
    private appTitleService: AppTitleService,
    private draftShowcaseService: DraftShowcaseService
  ) {
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

    this.subscription_id = activateRoute.params.subscribe(params => {
      this.id = params['id'];
      // Если это режим редактирования
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
          // Заполнить шаблоны описания нужными значениями, отобразить полный тип или деталь
          // Порядок вызова важен
          this.changeFullDescText(this.case.full_type);
          this.changeDescText(this.case.type);
        });
        // Иначе режим добавления объявления
      } else {
        // Если есть сохраненное объявление в хранилище - заполняем форму данными
        if (this.draftShowcaseService.getDraftedShowcase()) {
          let drSC = this.draftShowcaseService.getDraftedShowcase();
          this.form.patchValue(drSC);
          this.desc_template = drSC.description.description ? drSC.description.description : '';
          // Заполнить шаблоны описания нужными значениями, отобразить полный тип или деталь
          // Порядок вызова важен

          this.changeFullDescText(drSC.options.full_type);
          this.changeDescText(drSC.options.type);
        }
      }
    });
    this.subscription = this.translate.stream(this.id ? 'MAIN.EDITING_SHOWCASE' : 'MAIN.ADDING_SHOWCASE').subscribe((res: string) => {
      app.contentHeader = res;
      this.titleService.setTitle(res);
      this.appTitleService.setAppTitle(res);
    });
    this.translate.stream('SHOWCASE.BIKE.DESCRIPTION.TEMPLATE.COMPLETE').subscribe((res: string) => {
      this.templateFullComplete = res;
    });
    this.translate.stream('SHOWCASE.BIKE.DESCRIPTION.TEMPLATE.CUSTOM').subscribe((res: string) => {
      this.templateFullСustom = res;
    });
    this.translate.stream('SHOWCASE.BIKE.DESCRIPTION.TEMPLATE.COMPONENTS').subscribe((res: string) => {
      this.templateParts = res;
    });
    this.translate.stream('SHOWCASE.BIKE.DESCRIPTION.TEMPLATE.COMPONENT').subscribe((res: string) => {
      this.templateDetail = res;
    });
    this.translate.stream('SHOWCASE.BIKE.DESCRIPTION.TEMPLATE.ADDITIONAL').subscribe((res: string) => {
      this.descr_addition = res;
    });
  }

  ngOnInit() {
    // Инициализация всех опций объявлений
    this.initCaseOptions();
    // Если режим добавления, драфтим содержимое в localStorage
    if (!this.id) {
      this.form.valueChanges.subscribe((f) => {
        if (this.notEmptyForm(f)) {
          this.draftShowcaseService.draftShowcase(f);
        } else {
          this.draftShowcaseService.removeDraftedShowcase();
        }
      });
    }
  }

  private initCaseOptions() {
    this.http.get(this.API_URL + '?func=get_showcase_options').subscribe(response => {
      if (response['code'] === 0) {
        let options = response['text'];

        this.case_types = JSON.parse(options['types']);
        this.case_full_types = JSON.parse(options['full_types']);
        this.parts = JSON.parse(options['parts']);
        this.case_states = JSON.parse(options['states']);
        this.wheelSizes = JSON.parse(options['wheel_sizes']);
        this.bike_types = JSON.parse(options['bike_types']);
        this.bike_directions = JSON.parse(options['bike_directions']);
      }
    });
  }

  // Проверка на содержание содержимого, если в форме хоть одно заполненное поле
  private notEmptyForm(formData) {
    for (let f in formData) {
      if (formData.hasOwnProperty(f)) {
        for (let d in formData[f]) {
          if (formData[f][d] && !Array.isArray(formData[f][d])) {
            return true;
          }
          if (Array.isArray(formData[f][d]) && formData[f][d].length > 0) {
            return true;
          }
        }
      }
    }

    return false;
  }

  // TODO: Maybe later...
  // toggleChange(event) {
  //   let toggle = event.source;
  //   if (toggle) {
  //     let group = toggle.buttonToggleGroup;
  //     if (event.value.some(item => item == toggle.value)) {
  //       group.value = [toggle.value];
  //     }
  //   }
  // }

  private UploadPhoto() {
    this.form.get('main.photo').enable();
    document.getElementById('input_file_photo').click();
  }

  private fileChange(event) {
    let target = event.target || event.srcElement;
    this.img_name = target.value;
    this.files = target.files;
    this.form.get('main.photo').setValue(this.img_name);
  }

  private AddShowCase() {
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

      if (tmp['code'] == 0) {
        //Все ок
        this.file_path = tmp['text'] !== '' ? tmp['text'] : this.case.photo_url.replace('../assets/users_images/showcase_photos/', '');

        const update_params = this.id ? '&edit=true&id=' + this.id : '';
        this.http.post(this.API_URL + '?func=save_showcase&file_path=' + this.file_path + update_params, this.form.getRawValue()
        ).subscribe(response => {
          var tmp;
          tmp = response;
          this.code_one_errors = '';
          this.success_adding = '';

          if (tmp['code'] == 0) {
            //Все ок, выводим текст удачного сохранения данных
            this.draftShowcaseService.removeDraftedShowcase();
            this.success_adding = tmp['text'];
            this.snackbar.show_message(this.success_adding);
            // TODO route to added showcase
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

  private showDescTeplate() {
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

  private changeDescText(ev) {
    this.isHiddenFull = true;
    this.isHiddenDetail = true;

    // Если в сборе
    if (ev == 1) {
      this.isHiddenFull = false;
      // Если комплит
      if (this.desc_full_num == 1) {
        this.desc_num = 4;
        // Если кастом
      } else if (this.desc_full_num == 2) {
        this.desc_num = 5;
      } else {
        this.desc_num = 1;
      }
      // Если деребан 
    } else if (ev == 2) {
      this.desc_num = 2;
      // Если деталь
    } else if (ev == 3) {
      this.isHiddenDetail = false;
      this.desc_num = 3;
    }
  }

  private changeFullDescText(ev) {
    // Если комплит
    if (ev == 1) {
      this.desc_full_num = 1;
      this.desc_num = 4;
      // Если кастом
    } else if (ev == 2) {
      this.desc_full_num = 2;
      this.desc_num = 5;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription_id.unsubscribe();
  }
}
