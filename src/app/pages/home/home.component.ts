import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MenuModel } from './models/menu.model';
import { DeliveryService } from 'src/app/services/delivery.service';
import { Deliveries } from 'src/app/services/model/delivery.model';
import { first } from 'rxjs';
import { DeliveriesStateService } from 'src/app/services/state/deliveries.state.service';
import { Router } from '@angular/router';

/** @title Responsive sidenav */
@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrl: 'home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  showDashboard: boolean;
  showDeliveryList: boolean;

  menu: MenuModel[] = [
    {
      title: 'Dashboard',
      icon: 'insert_chart'
    },
    {
      title: 'Lista de entregas',
      icon: 'view_list'
    }

  ]

  private _mobileQueryListener: () => void;

  constructor(
    private router: Router,
    private deliveryService: DeliveryService,
    private state: DeliveriesStateService) {
    const changeDetectorRef = inject(ChangeDetectorRef);
    const media = inject(MediaMatcher);

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit(): void {
    this.setShowDashboard(true);
    this.getDeliveries();
  }

  getDeliveries(): void {
    this.deliveryService
      .getDeliveries()
      .pipe(first())
      .subscribe((deliveries: Deliveries) => {
        this.state.setDeliveries(deliveries);
      });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  handleClickScreensRedirects(nav: string): void {
    const route = nav.toLowerCase() === 'dashboard' ? '/dashboard' : '/deliveries';
    this.router.navigate([route]);
  }

  setShowDashboard(showDashboard: boolean): void {
    this.showDashboard = showDashboard;
  }

  setShowDeliveryList(showDeliveryList: boolean): void {
    this.showDeliveryList = showDeliveryList;
  }

  shouldRun = /(^|.)(stackblitz|webcontainer).(io|com)$/.test(window.location.host);
}


/**  Copyright 2024 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://angular.io/license */