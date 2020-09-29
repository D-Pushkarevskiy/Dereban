import { Injectable } from "@angular/core";

import { Observable, Subject } from 'rxjs';

@Injectable()

export class ProfileService {

    private name = new Subject<any>();
    private id = new Subject<any>();
    private area = new Subject<any>();
    private caseCount = new Subject<any>();

    public setName(uName) {
        this.name.next({ value: uName });
    }

    public getName(): Observable<any> {
        return this.name.asObservable();
    }

    public setId(uId) {
        this.id.next({ value: uId });
    }

    public getId(): Observable<any> {
        return this.id.asObservable();
    }

    public setArea(uArea) {
        this.area.next({ value: uArea });
    }

    public getArea(): Observable<any> {
        return this.area.asObservable();
    }

    public setShowcasesCount(uCaseCount, uCaseLimit) {
        this.caseCount.next({ value: uCaseCount, limit: uCaseLimit });
    }

    public getShowcasesCount(): Observable<any> {
        return this.caseCount.asObservable();
    }
}