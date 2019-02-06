import {Component, OnInit} from '@angular/core';
import {getAdsService} from 'src/app/shared/getAds.service';
import {AuthService} from 'src/app/shared/auth.service';
import {Subscription} from 'rxjs';
import {AppComponent} from 'src/app/app.component';

@Component({
    selector: 'app-ads-list',
    templateUrl: './ads-list.component.html',
    styleUrls: ['./ads-list.component.css']
})
export class AdsListComponent implements OnInit {
    isAuth;
    subscription: Subscription;

    constructor(
        private app: AppComponent,
        public getAds: getAdsService,
        private authService: AuthService
    ) {
        this.subscription = this.authService.getState().subscribe(state => {
            this.isAuth = state.value;
        });
    }

    ngOnInit() {
        this.authService.logIn();
    }
    
    ZoomImage(event: any){
        event.target.classList.toggle('opacity-img');
        document.querySelector("body").classList.toggle('stop-scroll');
        this.app.overlay = true;
        if(event.target.classList.contains('zoomed-img')){
            this.app.overlay = false;            
        }
        setTimeout(function() {
            event.target.classList.toggle('zoomed-img');
        }, 25);
    }

}
