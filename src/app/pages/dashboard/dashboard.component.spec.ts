import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { DeliveriesStateService } from 'src/app/services/state/deliveries.state.service';
import { ChartBuilderService } from 'src/app/services/chart-builder.service';
import { ChartConfiguratorService } from 'src/app/services/chart-configurator-service';
import { of, throwError } from 'rxjs';
import { Deliveries } from 'src/app/services/model/delivery.model';
import { ChartDataPoint, ChartOptions, DataPoint } from 'src/app/services/interfaces/chart-options.interface';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let deliveriesStateServiceMock: jasmine.SpyObj<DeliveriesStateService>;
  let chartBuilderServiceMock: jasmine.SpyObj<ChartBuilderService>;
  let chartConfiguratorServiceMock: jasmine.SpyObj<ChartConfiguratorService>;

  beforeEach(async () => {
    deliveriesStateServiceMock = jasmine.createSpyObj('DeliveriesStateService', ['getDeliveries']);
    chartBuilderServiceMock = jasmine.createSpyObj('ChartBuilderService', ['someMethod']); // Se houver métodos a serem mockados
    chartConfiguratorServiceMock = jasmine.createSpyObj('ChartConfiguratorService', [
      'createFirstVisionChart',
      'createSecondVisionChart',
      'createThirdVisionChart'
    ]);

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        { provide: DeliveriesStateService, useValue: deliveriesStateServiceMock },
        { provide: ChartBuilderService, useValue: chartBuilderServiceMock },
        { provide: ChartConfiguratorService, useValue: chartConfiguratorServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get deliveries on init', () => {
    const mockDeliveries: Deliveries = [
      {
        id: '1',
        documento: '987654321',
        motorista: { nome: 'Ana Costa' },
        cliente_origem: { nome: 'Carlos Lima', endereco: 'Rua dos Pássaros, 789', bairro: 'Jardim Tropical', cidade: 'Rio de Janeiro' },
        cliente_destino: { nome: 'Luiza Almeida', endereco: 'Praça da Árvore, 10', bairro: 'Vila Mariana', cidade: 'São Paulo' },
        status_entrega: 'Entregue',
      },
      {
        id: '2',
        documento: '987654321',
        motorista: { nome: 'Ana Costa' },
        cliente_origem: { nome: 'Carlos Lima', endereco: 'Rua dos Pássaros, 789', bairro: 'Jardim Tropical', cidade: 'Rio de Janeiro' },
        cliente_destino: { nome: 'Luiza Almeida', endereco: 'Praça da Árvore, 10', bairro: 'Vila Mariana', cidade: 'São Paulo' },
        status_entrega: 'Entregue',
      },
    ];

    const mockDataPoint1: DataPoint = {
      label: 'Produto A',
      y: 10,
    };

    const mockDataPoint2: DataPoint = {
      label: 'Produto B',
      y: 20,
    };

    const mockChartDataPoint: ChartDataPoint = {
      type: 'column',
      name: 'Vendas',
      legendText: 'Vendas por Produto',
      showInLegend: true,
      dataPoints: [mockDataPoint1, mockDataPoint2],
    };

    const mockChartOptions: ChartOptions = {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: 'Relatório de Vendas',
        fontFamily: 'Arial',
      },
      axisY: {
        valueFormatString: '#',
        interval: 1,
      },
      toolTip: {
        shared: true,
      },
      legend: {
        cursor: 'pointer',
        itemclick: (e: any) => {
          console.log('Item clicked:', e);
        },
      },
      data: [mockChartDataPoint],
    };

    deliveriesStateServiceMock.getDeliveries.and.returnValue(of(mockDeliveries));
    chartConfiguratorServiceMock.createFirstVisionChart.and.returnValue(mockChartOptions);
    chartConfiguratorServiceMock.createSecondVisionChart.and.returnValue(mockChartOptions);
    chartConfiguratorServiceMock.createThirdVisionChart.and.returnValue(mockChartOptions);

    component.ngOnInit();

    expect(deliveriesStateServiceMock.getDeliveries).toHaveBeenCalled();
    expect(component.deliveries).toEqual(mockDeliveries);
    expect(chartConfiguratorServiceMock.createFirstVisionChart).toHaveBeenCalledWith(mockDeliveries);
    expect(chartConfiguratorServiceMock.createSecondVisionChart).toHaveBeenCalledWith(mockDeliveries);
    expect(chartConfiguratorServiceMock.createThirdVisionChart).toHaveBeenCalledWith(mockDeliveries);
  });

  it('should handle error when getting deliveries', () => {
    deliveriesStateServiceMock.getDeliveries.and.returnValue(throwError('Error fetching deliveries'));

    component.ngOnInit();

    expect(deliveriesStateServiceMock.getDeliveries).toHaveBeenCalled();
    expect(component.deliveries).toEqual([]); // Assume deliveries inicia como um array vazio
  });

  it('should unsubscribe on destroy', () => {
    const nextSpy = spyOn(component['destroy$'], 'next');
    const completeSpy = spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
