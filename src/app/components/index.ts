import { HeaderComponent } from './header/header.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { ConfirmRegistrationComponent } from './confirm-registration/confirm-registration.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { AddingAdComponent } from './adding-ad/adding-ad.component';
import { AdDetailComponent } from './ad-detail/ad-detail.component';
import { UserAdsComponent } from './user-ads/user-ads.component';
import { FavoritesAdsComponent } from './favorites-ads/favorites-ads.component';
import { AdsListComponent } from './ads-list/ads-list.component';
import { LoaderComponent } from './loader/loader.component';

export const Components = [
    { provide: HeaderComponent, useClass: HeaderComponent, multi: true },
    { provide: HomepageComponent, useClass: HomepageComponent, multi: true },
    { provide: LoginComponent, useClass: LoginComponent, multi: true },
    { provide: ConfirmRegistrationComponent, useClass: ConfirmRegistrationComponent, multi: true },
    { provide: NotFoundComponent, useClass: NotFoundComponent, multi: true },
    { provide: ProfileComponent, useClass: ProfileComponent, multi: true },
    { provide: AddingAdComponent, useClass: AddingAdComponent, multi: true },
    { provide: AdDetailComponent, useClass: AdDetailComponent, multi: true },
    { provide: UserAdsComponent, useClass: UserAdsComponent, multi: true },
    { provide: FavoritesAdsComponent, useClass: FavoritesAdsComponent, multi: true },
    { provide: AdsListComponent, useClass: AdsListComponent, multi: true },
    { provide: LoaderComponent, useClass: LoaderComponent, multi: true },
];
