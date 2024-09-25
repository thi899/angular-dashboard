import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeliveryListComponent } from './delivery-list.component';
import { DeliveriesStateService } from 'src/app/services/state/deliveries.state.service';
import { DeliveriesDataSourceService } from 'src/app/services/deliveries-data-source.service';
import { MatPaginator } from '@angular/material/paginator';
import { of } from 'rxjs';
import { Delivery } from 'src/app/services/model/delivery.model';

describe('DeliveryListComponent', () => {
  let component: DeliveryListComponent;
  let fixture: ComponentFixture<DeliveryListComponent>;
  let deliveriesStateServiceMock: any;
  let deliveriesDataSourceServiceMock: any;

  const mockDeliveries: Delivery[] = [
    {
      id: '1',
      documento: '123456789',
      motorista: { nome: 'John Doe' },
      cliente_origem: { nome: 'Cliente A', endereco: 'av', bairro: 'vila', cidade: 'Campinas' },
      cliente_destino: { nome: 'Cliente B', endereco: 'av', bairro: 'sasa', cidade: 'sas' },
      status_entrega: 'Entregue',
    },
    {
      id: '2',
      documento: '987654321',
      motorista: { nome: 'Jane Doe' },
      cliente_origem: { nome: 'Cliente C', endereco: 'av', bairro: 'vila', cidade: 'Campinas' },
      cliente_destino: { nome: 'Cliente D', endereco: 'av', bairro: 'vila', cidade: 'Campinas' }, // Removido o segundo cliente_destino
      status_entrega: 'Pendente',
    },
  ];

  beforeEach(async () => {
    deliveriesStateServiceMock = {
      getDeliveries: jest.fn().mockReturnValue(of(mockDeliveries))
    };

    deliveriesDataSourceServiceMock = {
      setData: jest.fn(),
      setPaginator: jest.fn(),
      getDataSource: jest.fn().mockReturnValue({ data: [], filterPredicate: jest.fn() }),
      applyFilter: jest.fn(),
      getFilterPredicate: jest.fn().mockReturnValue(jest.fn())
    };

    await TestBed.configureTestingModule({
      declarations: [DeliveryListComponent],
      providers: [
        { provide: DeliveriesStateService, useValue: deliveriesStateServiceMock },
        { provide: DeliveriesDataSourceService, useValue: deliveriesDataSourceServiceMock },
      ],
      imports: []
    }).compileComponents();

    fixture = TestBed.createComponent(DeliveryListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getDeliveries on ngAfterViewInit', () => {
    const getDeliveriesSpy = jest.spyOn(component, 'getDeliveries');
    component.ngAfterViewInit();
    expect(getDeliveriesSpy).toHaveBeenCalled();
  });

  it('should retrieve deliveries and set them to dataSource', () => {
    component.ngAfterViewInit(); 

    expect(deliveriesStateServiceMock.getDeliveries).toHaveBeenCalled();
    expect(deliveriesDataSourceServiceMock.setData).toHaveBeenCalledWith(mockDeliveries);
    expect(deliveriesDataSourceServiceMock.setPaginator).toHaveBeenCalled();
    expect(component.deliveries).toEqual(mockDeliveries);
    expect(component.displayedColumns).toEqual(Object.keys(mockDeliveries[0]));
  });

  it('should apply filter correctly', () => {
    const filterValue = 'John';
    component.applyFilter(filterValue);
    expect(deliveriesDataSourceServiceMock.applyFilter).toHaveBeenCalledWith(expect(filterValue));
  });

  it('should clean input for filtering', () => {
    const rawInput = '  Hello World!  ';
    const cleanedInput = component['cleanInput'](rawInput);
    expect(cleanedInput).toBe('hello world');
  });

  it('should unsubscribe on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
