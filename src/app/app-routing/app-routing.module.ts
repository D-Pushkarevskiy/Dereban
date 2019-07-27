import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Router } from '@angular/router';

import { ConfirmRegistrationComponent } from 'src/app/components/confirm-registration/confirm-registration.component';
import { HomepageComponent } from 'src/app/components/homepage/homepage.component';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { ProfileComponent } from 'src/app/components/profile/profile.component';
import { AddingAdComponent } from 'src/app/components/adding-ad/adding-ad.component';
import { AdDetailComponent } from 'src/app/components/ad-detail/ad-detail.component';
import { UserAdsComponent } from 'src/app/components/user-ads/user-ads.component';
import { FavoritesAdsComponent } from 'src/app/components/favorites-ads/favorites-ads.component';

const appRoutes: Routes = [
    { path: '', component: HomepageComponent },
    { path: 'confirm-registration/:regToken', component: ConfirmRegistrationComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'adding-ad', component: AddingAdComponent },
    { path: 'ad/:id', component: AdDetailComponent },
    { path: 'allads/:id', component: UserAdsComponent },
    { path: 'favorites/:id', component: FavoritesAdsComponent },
    { path: '**', component: NotFoundComponent },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule],
    declarations: []
})
export class AppRoutingModule {

}
