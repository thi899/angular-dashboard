import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeliveryListComponent } from './delivery-list.component';
import { DeliveriesStateService } from 'src/app/services/state/deliveries.state.service';
import { DeliveriesDataSourceService } from 'src/app/services/deliveries-data-source.service';
import { of } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

describe('DeliveryListComponent', () => {
  let component: DeliveryListComponent;
  let fixture: ComponentFixture<DeliveryListComponent>;
  let deliveriesStateServiceMock: jasmine.SpyObj<DeliveriesStateService>;
  let deliveriesDataSourceServiceMock: jasmine.SpyObj<DeliveriesDataSourceService>;

  beforeEach(() => {
    deliveriesStateServiceMock = jasmine.createSpyObj('DeliveriesStateService', ['getDeliveries']);
    deliveriesDataSourceServiceMock = jasmine.createSpyObj('DeliveriesDataSourceService', ['setData', 'setPaginator', 'getDataSource', 'getFilterPredicate', 'applyFilter']);

    TestBed.configureTestingModule({
      declarations: [DeliveryListComponent],
      providers: [
        { provide: DeliveriesStateService, useValue: deliveriesStateServiceMock },
        { provide: DeliveriesDataSourceService, useValue: deliveriesDataSourceServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeliveryListComponent);
    component = fixture.componentInstance;
    deliveriesStateServiceMock.getDeliveries.and.returnValue(of([])); 
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getDeliveries on ngAfterViewInit', () => {
    spyOn(component, 'getDeliveries').and.callThrough();
    component.ngAfterViewInit();
    expect(component.getDeliveries).toHaveBeenCalled();
  });

  it('should set deliveries and update dataSource in getDeliveries', () => {
    const mockDeliveries = [
      { id: '1', documento: 'DOC1', motorista: { nome: 'Driver 1' }, cliente_origem: { nome: 'Client A', endereco: '', bairro: '', cidade: '' }, cliente_destino: { nome: 'Client B', endereco: '', bairro: '', cidade: '' }, status_entrega: 'Pending' }
    ];
    
    deliveriesStateServiceMock.getDeliveries.and.returnValue(of(mockDeliveries));
    
    component.ngAfterViewInit();
    
    expect(component.deliveries).toEqual(mockDeliveries);
    expect(component.displayedColumns).toEqual(Object.keys(mockDeliveries[0]));
    expect(deliveriesDataSourceServiceMock.setData).toHaveBeenCalledWith(mockDeliveries);
    expect(deliveriesDataSourceServiceMock.setPaginator).toHaveBeenCalledWith(component.paginator);
  });

  it('should apply filter', () => {
    const filterValue = 'test';
    spyOn(component, 'cleanInput').and.returnValue(filterValue);
    component.applyFilter(filterValue);
    
    expect(component.cleanInput).toHaveBeenCalledWith(filterValue);
    expect(deliveriesDataSourceServiceMock.applyFilter).toHaveBeenCalledWith(filterValue);
  });

  it('should clean input', () => {
    const input = '  Test Input! ';
    const expectedOutput = 'test input';
    const result = component.cleanInput(input);
    expect(result).toEqual(expectedOutput);
  });
});
