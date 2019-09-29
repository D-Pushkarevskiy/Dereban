import { Injectable } from "@angular/core";

import { Observable, Subject } from 'rxjs';

@Injectable()

export class ProfileService {

    private name = new Subject<any>();
    private id = new Subject<any>();
    private area = new Subject<any>();

    setName(uName) {
        this.name.next({ value: uName });
    }

    getName(): Observable<any> {
        return this.name.asObservable();
    }
    
    setId(uId) {
        this.id.next({ value: uId });
    }

    getId(): Observable<any> {
        return this.id.asObservable();
    }

    setArea(uArea) {
        this.area.next({ value: uArea });
    }

    getArea(): Observable<any> {
        return this.area.asObservable();
    }
}