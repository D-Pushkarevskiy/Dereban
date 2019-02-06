import {Injectable} from "@angular/core";
import {Observable, Subject} from 'rxjs';
import {Http} from "@angular/http";

@Injectable()

export class adInfoService {
    private subject = new Subject<any>();
    
    setCaseName(uName){
        this.subject.next({value: uName});
    }

    getCaseName(): Observable<any> {
        return this.subject.asObservable();
    }
}