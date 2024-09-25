import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { Deliveries, Delivery } from 'src/app/services/model/delivery.model';
import { DeliveriesStateService } from 'src/app/services/state/deliveries.state.service';

@Component({
  selector: 'app-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrl: './delivery-list.component.scss'
})
export class DeliveryListComponent implements AfterViewInit, OnDestroy {
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('inputFilter') inputFilter: ElementRef;

  private destroy$ = new Subject<void>();

  deliveries: Deliveries;
  displayedColumns: string[];
  dataSource: MatTableDataSource<Delivery>;

  constructor(private state: DeliveriesStateService) { }

  ngAfterViewInit(): void {
    this.getDeliveries();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDeliveries(): void {
    this.state
      .getDeliveries()
      .pipe(takeUntil(this.destroy$))
      .subscribe((deliveries: Deliveries) => {
        this.deliveries = deliveries;
        this.displayedColumns = Object?.keys(this.deliveries[0]);
        this.dataSource = new MatTableDataSource(this.deliveries);
        this.dataSource.paginator = this.paginator;
      });

  }

  applyFilter(value: string) {
    const filterValue = this.cleanInput(value);

    this.dataSource.filterPredicate = (data: Delivery, filter: string) => {
      return this.matchesFilter(data.id, filter) ||
        this.matchesFilter(data.documento, filter) ||
        this.matchesFilter(data.motorista?.nome, filter) ||
        this.matchesFilter(data.cliente_origem?.nome, filter) ||
        this.matchesFilter(data.cliente_origem?.endereco, filter) ||
        this.matchesFilter(data.cliente_origem?.cidade, filter) ||
        this.matchesFilter(data.cliente_destino?.nome, filter) ||
        this.matchesFilter(data.cliente_destino?.endereco, filter) ||
        this.matchesFilter(data.cliente_destino?.cidade, filter) ||
        this.matchesFilter(data.status_entrega, filter);
    };

    this.dataSource.filter = filterValue;
  }

  private cleanInput(value: string): string {
    return value.trim().toLowerCase().normalize("NFD").replace(/[^\w\s]/gi, '').replace(/[\u0300-\u036f]/g, '');
  }

  private matchesFilter(field: string | undefined, filter: string): boolean {
    if (!field) return false;

    const normalizedField = field.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase();
    return normalizedField.includes(filter);
  }


}
