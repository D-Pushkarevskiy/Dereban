import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { ProfileService } from '../services/profile.service';

@Injectable({ providedIn: 'root' })
export class CaseLimit implements CanActivate {

    constructor(private router: Router, private profileService: ProfileService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return Boolean(this.profileService.getShowcasesCount().subscribe((c) => {
            if (!(+c.value < c.limit)) {
                this.router.navigate(['/']);
            }
            return +c.value < c.limit;
        }));
    }
}