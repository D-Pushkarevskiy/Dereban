import {Injectable} from "@angular/core";
import {Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {Http} from "@angular/http";

@Injectable()

export class ProfileService {

    private subject = new Subject<any>();
    
    setName(uName){
        this.subject.next({value: uName});
    }

    getName(): Observable<any> {
        return this.subject.asObservable();
    }
}