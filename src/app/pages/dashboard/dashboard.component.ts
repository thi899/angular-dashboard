import { Component, OnInit } from '@angular/core';
import { Deliveries } from 'src/app/services/model/delivery.model';
import { DeliveriesStateService } from 'src/app/services/state/deliveries.state.service';
import { ResultModel } from './models/result.model';
import { DataPointsModel } from './models/datapoints.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'] // Corrigido: "styleUrls"
})
export class DashboardComponent implements OnInit {

  deliveries: Deliveries = [];
  chartOptionsFirstVision: {};
  chartOptionsSecondVision: {};

  constructor(private state: DeliveriesStateService) { }

  ngOnInit(): void {
    this.getDeliveries();
  }


  getDeliveries(): void {
    this.state
      .getDeliveries()
      .subscribe((deliveries) => {
        this.deliveries = deliveries
        this.setChartOptionsFirstVision();
        this.setChartOptionsSecondVision();
      });
  }

  setChartOptionsFirstVision(): void {
    this.chartOptionsFirstVision = {
      animationEnabled: true,
      title: {
        text: "Andamento de entregas por motorista"
      },
      axisX: {
        labelAngle: -90
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        itemclick: function (e: any) {
          if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
          }
          else {
            e.dataSeries.visible = true;
          }
          e.chart.render();
        }
      },
      data: [{
        type: "column",
        name: "Entregues",
        legendText: "entregues",
        showInLegend: true,
        dataPoints: this.contarStatusPorMotorista(this.deliveries)?.entregues
      }, {
        type: "column",
        name: "Pendentes",
        legendText: "Pendentes",
        axisYType: "secondary",
        showInLegend: true,
        dataPoints: this.contarStatusPorMotorista(this.deliveries)?.pendentes
      }]
    }
  }

  setChartOptionsSecondVision(): void {
    this.chartOptionsSecondVision = {
      title: {
        text: "Total Impressions by Platforms"
      },
      animationEnabled: true,
      axisY: {
        includeZero: true,
        suffix: "K"
      },
      data: [{
        type: "bar",
        indexLabel: "{y}",
        yValueFormatString: "#,###K",
        dataPoints: [
          { label: "Snapchat", y: 15 },
          { label: "Instagram", y: 20 },
          { label: "YouTube", y: 24 },
          { label: "Twitter", y: 29 },
          { label: "Facebook", y: 73 }
        ]
      }]
    }
  }

  contarStatusPorMotorista(entregas: Deliveries) {

    const resultado: ResultModel[] = [];
    const dataPointsStatusPending: DataPointsModel[] = [];
    const dataPointsStatusDelivered: DataPointsModel[] = [];
    const dataPointsStatusInsuccess: DataPointsModel[] = [];

    for (const entrega of entregas) {
      const { nome } = entrega.motorista;
      const status = entrega.status_entrega;

      let motorista = resultado.find(m => m.nome === nome);

      if (!motorista) {
        motorista = { nome, totalPendente: 0, totalEntregue: 0, totalInsucesso: 0 };
        resultado.push(motorista);
      }

      if (status.toLocaleLowerCase().includes('pendente')) {
        motorista.totalPendente++;
      }

      if (status.toLocaleLowerCase().includes('entregue')) {
        motorista.totalEntregue++;
      }

      if (status.toLocaleLowerCase().includes('insucesso')) {
        motorista.totalEntregue++;
      }
    }

    resultado.map((result) => {

      dataPointsStatusPending.push({
        label: result.nome,
        y: result.totalPendente
      });

      dataPointsStatusDelivered.push({
        label: result.nome,
        y: result.totalEntregue
      });

      dataPointsStatusInsuccess.push({
        label: result.nome,
        y: result.totalInsucesso
      });

    })

    console.log(
      {
        pendentes: dataPointsStatusPending,
        entregues: dataPointsStatusDelivered
      }

    )



    return {
      pendentes: dataPointsStatusPending,
      entregues: dataPointsStatusDelivered,
      insucessos: dataPointsStatusInsuccess
    }

  }




}
