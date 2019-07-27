import { Injectable } from "@angular/core";

import { Observable, Subject } from 'rxjs';

@Injectable()

export class AdInfoService {
    private subject = new Subject<any>();

    setCaseName(uName) {
        this.subject.next({ value: uName });
    }

    getCaseName(): Observable<any> {
        return this.subject.asObservable();
    }
}