import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class HomeGuard implements CanActivate {

    constructor(private router: Router, private AuthService: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.AuthService.getAuthToken()) {
            console.log('LogIn user now');
            this.AuthService.logIn();
        } else {
            console.log('LogOut user now');
            this.AuthService.logOut();
        }

        return true;
    }
}