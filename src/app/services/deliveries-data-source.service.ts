import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Delivery } from 'src/app/services/model/delivery.model';

@Injectable({
    providedIn: 'root',
})
export class DeliveriesDataSourceService {
    private dataSource: MatTableDataSource<Delivery>;

    constructor() {
        this.dataSource = new MatTableDataSource<Delivery>([]);
    }

    get getDataSource(): MatTableDataSource<Delivery> {
        return this.dataSource;
    }

    setData(deliveries: Delivery[]) {
        this.dataSource.data = deliveries;
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    setPaginator(paginator: MatPaginator) {
        this.dataSource.paginator = paginator;
    }

    getFilterPredicate() {
        return (data: Delivery, filter: string): boolean => {
            const normalizedFilter = filter.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase();

            return this.matchesFilter(data.id.toString(), normalizedFilter) ||
                this.matchesFilter(data.documento, normalizedFilter) ||
                this.matchesFilter(data.motorista?.nome, normalizedFilter) ||
                this.matchesFilter(data.cliente_origem?.nome, normalizedFilter) ||
                this.matchesFilter(data.cliente_origem?.endereco, normalizedFilter) ||
                this.matchesFilter(data.cliente_origem?.cidade, normalizedFilter) ||
                this.matchesFilter(data.cliente_destino?.nome, normalizedFilter) ||
                this.matchesFilter(data.cliente_destino?.endereco, normalizedFilter) ||
                this.matchesFilter(data.cliente_destino?.cidade, normalizedFilter) ||
                this.matchesFilter(data.status_entrega, normalizedFilter);
        };
    }

    private matchesFilter(field: string | undefined, filter: string): boolean {
        if (!field) return false;

        const normalizedField = field.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase();
        return normalizedField.includes(filter);
    }
}
