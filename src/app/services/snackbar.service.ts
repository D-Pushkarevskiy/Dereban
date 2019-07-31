import { Injectable } from "@angular/core";
import { MatSnackBar } from '@angular/material';

@Injectable({
    providedIn: 'root'
})

export class SnackbarService {
    constructor(
        public snackBar: MatSnackBar
    ) { }
    
    public show_message(msg_text) {
        if (msg_text != '') {
            this.snackBar.open(msg_text, '', {
                duration: 3000,
            });
        }
    }
}