import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { LoaderService } from '../../services/loader.service';
import { LoaderState } from '../../loader/loader';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit, OnDestroy {
  show = false;
  private subscription: Subscription;
  constructor(private loaderService: LoaderService) {
    console.log(this.show);
  }
  ngOnInit() {
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
        console.log(this.show);
      });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}