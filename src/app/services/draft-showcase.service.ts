import { Injectable } from "@angular/core";

@Injectable()

export class DraftShowcaseService {
    draftShowcase(draftedShowcaseForm) {
        localStorage.setItem('drafted-showcase-data', JSON.stringify(draftedShowcaseForm));
    }

    getDraftedShowcase() {
        return JSON.parse(localStorage.getItem('drafted-showcase-data')) || false;
    }

    removeDraftedShowcase() {
        localStorage.removeItem('drafted-showcase-data');
    }
}