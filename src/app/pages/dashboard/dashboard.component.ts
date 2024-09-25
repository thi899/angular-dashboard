import { Component, OnDestroy, OnInit } from '@angular/core';
import { Deliveries } from 'src/app/services/model/delivery.model';
import { DeliveriesStateService } from 'src/app/services/state/deliveries.state.service';
import { Subject, takeUntil } from 'rxjs';
import { ChartBuilderService } from 'src/app/services/chart-builder.service';
import { ChartConfiguratorService } from 'src/app/services/chart-configurator-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'] // Corrigido: "styleUrls"
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  deliveries: Deliveries = [];
  chartOptionsFirstVision: {};
  chartOptionsSecondVision: {};
  chartOptionsThirdVision: {};

  constructor(
    private state: DeliveriesStateService,
    private chartBuilderService: ChartBuilderService,
    private chartConfiguratorService: ChartConfiguratorService) { }

  ngOnInit(): void {
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
      .subscribe((deliveries) => {
        this.deliveries = deliveries
        this.chartOptionsFirstVision = this.chartConfiguratorService.createFirstVisionChart(this.deliveries);
        this.chartOptionsSecondVision = this.chartConfiguratorService.createSecondVisionChart(this.deliveries);
        this.chartOptionsThirdVision = this.chartConfiguratorService.createThirdVisionChart(this.deliveries);
      });
  }

}
