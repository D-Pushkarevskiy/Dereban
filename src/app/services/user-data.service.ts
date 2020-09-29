import { Injectable } from "@angular/core";

import { Observable, Subject } from 'rxjs';

@Injectable()

export class UserDataService {
    private subject = new Subject<any>();

    getUserData() {
        this.subject.next(true);
    }

    userDataSubscriber(): Observable<any> {
        return this.subject.asObservable();
    }
}