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

import { AuthGuard } from '../guards/auth.guard';
import { HomeGuard } from '../guards/home.guard';

const appRoutes: Routes = [
    { path: '', component: HomepageComponent, canActivate: [HomeGuard] },
    { path: 'confirm-registration/:regToken', component: ConfirmRegistrationComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'adding-ad', component: AddingAdComponent, canActivate: [AuthGuard] },
    { path: 'ad/:id', component: AdDetailComponent, canActivate: [HomeGuard] },
    { path: 'allads/:id', component: UserAdsComponent, canActivate: [HomeGuard] },
    { path: 'favorites/:id', component: FavoritesAdsComponent, canActivate: [AuthGuard] },
    { path: '**', component: NotFoundComponent, canActivate: [HomeGuard] },
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
