import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule , MatCheckboxModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
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

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { ConfirmRegistrationComponent } from './confirm-registration/confirm-registration.component';
import { AppRoutingModule } from 'src/app/app-routing/app-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthService } from 'src/app/shared/auth.service';
import { ProfileComponent } from './profile/profile.component';
import { AddingAdComponent } from './adding-ad/adding-ad.component';
import { ProfileService } from 'src/app/shared/profile.service';
import { AdDetailComponent } from './ad-detail/ad-detail.component';
import { adInfoService } from 'src/app/shared/adInfo.service';
import { UserAdsComponent } from './user-ads/user-ads.component';
import {getAdsService} from 'src/app/shared/getAds.service';
import { FavoritesAdsComponent } from './favorites-ads/favorites-ads.component';
import { AdsListComponent } from './ads-list/ads-list.component';

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
    AdsListComponent
  ],
  entryComponents: [LoginComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
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
  providers: [AuthService, ProfileService, adInfoService, getAdsService, AppComponent, AdsListComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
