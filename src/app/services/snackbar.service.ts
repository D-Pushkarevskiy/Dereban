import { Injectable } from "@angular/core";
import { MatSnackBar } from '@angular/material';
import { TranslateService } from "@ngx-translate/core";

@Injectable({
    providedIn: 'root'
})

export class SnackbarService {
    constructor(
        public snackBar: MatSnackBar,
        private translateService: TranslateService
    ) { }

    public show_message(msg_text) {
        if (msg_text != '') {
            this.snackBar.open(this.translateService.instant('API_RESPONSE.' + msg_text), '', {
                duration: 3000,
                verticalPosition: 'top'
            });
        }
    }
}