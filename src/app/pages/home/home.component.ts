import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MenuModel } from './models/menu.model';
import { DeliveryService } from 'src/app/services/delivery.service';
import { Deliveries } from 'src/app/services/model/delivery.model';
import { catchError, of, Subject, takeUntil } from 'rxjs';
import { DeliveriesStateService } from 'src/app/services/state/deliveries.state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  showDashboard = true;
  menu: MenuModel[] = this.getMenuItems();
  
  private destroy$ = new Subject<void>();
  private _mobileQueryListener: () => void;

  constructor(
    private router: Router,
    private deliveryService: DeliveryService,
    private state: DeliveriesStateService,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.loadDeliveries();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleClickScreensRedirects(nav: string): void {
    const route = nav.toLowerCase() === 'dashboard' ? '/dashboard' : '/deliveries';
    this.router.navigate([route]);
  }

  private loadDeliveries(): void {
    this.deliveryService.getDeliveries().pipe(
      takeUntil(this.destroy$),
      catchError(err => {
        console.error('Erro ao buscar entregas:', err);
        return of([]);
      })
    ).subscribe((deliveries: Deliveries) => {
      this.state.setDeliveries(deliveries);
    });
  }

  private getMenuItems(): MenuModel[] {
    return [
      { title: 'Dashboard', icon: 'insert_chart' },
      { title: 'Lista de entregas', icon: 'view_list' }
    ];
  }
}
