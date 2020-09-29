import { Injectable } from "@angular/core";

@Injectable()

export class AppTitleService {
    public appTitle: string;

    constructor() {
        this.appTitle = '';
    }

    public setAppTitle(title: string) {
        this.appTitle = title;
    }

    public getAppTitle() {
        return this.appTitle;
    }
}