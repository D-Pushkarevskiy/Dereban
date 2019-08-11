import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';

import { AppRoutingModule } from 'src/app/app-routing/app-routing.module';

import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { AdInfoService } from 'src/app/services/adInfo.service';
import { GetAdsService } from 'src/app/services/getAds.service';
import { LangService } from 'src/app/services/lang.service';

import { ShortNumberPipe } from 'src/app/pipes/short-number.pipe';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { ConfirmRegistrationComponent } from './components/confirm-registration/confirm-registration.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AddingAdComponent } from './components/adding-ad/adding-ad.component';
import { AdDetailComponent } from './components/ad-detail/ad-detail.component';
import { UserAdsComponent } from './components/user-ads/user-ads.component';
import { FavoritesAdsComponent } from './components/favorites-ads/favorites-ads.component';
import { AdsListComponent } from './components/ads-list/ads-list.component';
import { LoaderComponent } from './components/loader/loader.component';

import { httpInterceptorProviders } from './interceptors/index';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomepageComponent,
    LoginComponent,
    ConfirmRegistrationComponent,
    NotFoundComponent,
    ProfileComponent,
    AddingAdComponent,
    AdDetailComponent,
    UserAdsComponent,
    FavoritesAdsComponent,
    AdsListComponent,
    LoaderComponent,
    ShortNumberPipe
  ],
  entryComponents: [LoginComponent],
  imports: [
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    LayoutModule,
    MatSidenavModule,
    MatDialogModule,
    MatInputModule,
    MatTooltipModule,
    MatCardModule,
    AppRoutingModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatMenuModule,
    FormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatPaginatorModule
  ],
  providers: [httpInterceptorProviders, AuthService, ProfileService, AdInfoService, GetAdsService, LangService, AppComponent, AdsListComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
