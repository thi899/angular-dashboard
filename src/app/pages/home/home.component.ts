import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MenuModel } from './models/menu.model';
import { DeliveryService } from 'src/app/services/delivery.service';
import { Deliveries } from 'src/app/services/model/delivery.model';
import { first } from 'rxjs';
import { DeliveriesStateService } from 'src/app/services/state/deliveries.state.service';

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

  fillerContent = Array.from(
    { length: 50 },
    () =>
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
       labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
       laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
       voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
       cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  );

  private _mobileQueryListener: () => void;

  constructor(
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
    if (nav.toLowerCase().includes('dashboard')) {
      this.setShowDeliveryList(false);
      return this.setShowDashboard(true);
    }

    this.setShowDashboard(false);
    return this.setShowDeliveryList(true);
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