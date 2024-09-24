import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Deliveries, Delivery } from 'src/app/services/model/delivery.model';
import { DeliveriesStateService } from 'src/app/services/state/deliveries.state.service';

@Component({
  selector: 'app-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrl: './delivery-list.component.scss'
})
export class DeliveryListComponent implements AfterViewInit {
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('inputFilter') inputFilter: ElementRef;

  deliveries: Deliveries;

  displayedColumns: string[];

  dataSource: MatTableDataSource<Delivery>;

  constructor(private state: DeliveriesStateService) {

  }
  ngAfterViewInit(): void {
    this.getDeliveries();
  }

  getDeliveries(): void {
    this.state
      .getDeliveries()
      .subscribe((deliveries: Deliveries) => {
        this.deliveries = deliveries;
        this.displayedColumns = Object.keys(this.deliveries[0]);
        this.dataSource = new MatTableDataSource(this.deliveries);
        this.dataSource.paginator = this.paginator;
      });

  }

  applyFilter(value: string) {

    const filterValue = value.trim().toLowerCase();
  
    this.dataSource.filterPredicate = (data: Delivery, filter: string) => {
      return data.id.toString().includes(filter) ||
             data.documento.toLowerCase().includes(filter) ||
             (data.motorista && data.motorista.nome.toLowerCase().includes(filter)) ||
             (data.cliente_origem && data.cliente_origem.nome.toLowerCase().includes(filter)) ||
             (data.cliente_destino && data.cliente_destino.nome.toLowerCase().includes(filter)) ||
             data.status_entrega.toLowerCase().includes(filter);
    };
  
    this.dataSource.filter = filterValue;
  }
  

}
