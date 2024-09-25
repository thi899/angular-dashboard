import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { DeliveryService } from 'src/app/services/delivery.service';
import { DeliveriesStateService } from 'src/app/services/state/deliveries.state.service';
import { ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { of } from 'rxjs';
import { Deliveries } from 'src/app/services/model/delivery.model';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockDeliveryService: jasmine.SpyObj<DeliveryService>;
  let mockDeliveriesStateService: jasmine.SpyObj<DeliveriesStateService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockDeliveryService = jasmine.createSpyObj('DeliveryService', ['getDeliveries']);
    mockDeliveriesStateService = jasmine.createSpyObj('DeliveriesStateService', ['setDeliveries']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: DeliveryService, useValue: mockDeliveryService },
        { provide: DeliveriesStateService, useValue: mockDeliveriesStateService },
        { provide: Router, useValue: mockRouter },
        { provide: ChangeDetectorRef, useValue: { detectChanges: () => {} } },
        { provide: MediaMatcher, useValue: { matchMedia: () => ({ addListener: () => {}, removeListener: () => {} }) } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load deliveries on init', () => {
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
    mockDeliveryService.getDeliveries.and.returnValue(of(mockDeliveries));

    component.ngOnInit();

    expect(mockDeliveryService.getDeliveries).toHaveBeenCalled();
    expect(mockDeliveriesStateService.setDeliveries).toHaveBeenCalledWith(mockDeliveries);
  });

  it('should navigate to dashboard on handleClickScreensRedirects with "dashboard"', () => {
    component.handleClickScreensRedirects('dashboard');

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should navigate to deliveries on handleClickScreensRedirects with other value', () => {
    component.handleClickScreensRedirects('entregas');

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/deliveries']);
  });

  it('should clean up on ngOnDestroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');
    
    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
