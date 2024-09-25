import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { DeliveriesDataSourceService } from 'src/app/services/deliveries-data-source.service';
import { Deliveries, Delivery } from 'src/app/services/model/delivery.model';
import { DeliveriesStateService } from 'src/app/services/state/deliveries.state.service';

@Component({
  selector: 'app-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.scss']
})
export class DeliveryListComponent implements AfterViewInit, OnDestroy {
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('inputFilter') inputFilter: ElementRef;

  dataSource: MatTableDataSource<Delivery>;

  private destroy$ = new Subject<void>();

  deliveries: Deliveries;
  displayedColumns: string[];

  constructor(
    private state: DeliveriesStateService,
    protected deliveryDataSource: DeliveriesDataSourceService
  ) { }

  ngAfterViewInit(): void {
    this.getDeliveries();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDeliveries(): void {
    this.state.getDeliveries()
      .pipe(takeUntil(this.destroy$))
      .subscribe((deliveries: Deliveries) => {
        this.deliveries = deliveries;
        this.displayedColumns = Object?.keys(this.deliveries[0]);
        this.deliveryDataSource.setData(this.deliveries);
        this.deliveryDataSource.setPaginator(this.paginator);
        this.dataSource = this.deliveryDataSource.getDataSource;
        this.dataSource.filterPredicate = this.deliveryDataSource.getFilterPredicate();
      });
  }

  applyFilter(value: string) {
    const filterValue = this.cleanInput(value);
    this.deliveryDataSource.applyFilter(filterValue);
  }

  public cleanInput(value: string): string {
    return value.trim().toLowerCase().normalize("NFD").replace(/[^\w\s]/gi, '').replace(/[\u0300-\u036f]/g, '');
  }
}
