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
  chartOptionsThirdVision: {};

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
        this.setChartOptionsThirdVision();
      });
  }

  setChartOptionsFirstVision(): void {
    this.chartOptionsFirstVision = {
      animationEnabled: true,
      title: {
        text: "Andamento de entregas por motorista"
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
        color: '#006A4E',
        type: "column",
        name: "Entregues",
        legendText: "entregues",
        showInLegend: true,
        dataPoints: this.contarStatusPorMotorista(this.deliveries)?.entregues
      }, {
        color: '#FFC72C',
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
        text: "Entregas sem sucesso por motorista",
      },
      data: [{
        color: "#D2122E",
        type: "column",
        dataPoints: this.contarStatusPorMotorista(this.deliveries)?.insucessos
      }, {
      }]
    };
  }

  setChartOptionsThirdVision(): void {
    this.chartOptionsThirdVision = {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Andamento de entregas por bairro",
        fontFamily: "Calibri, Arial, sans-serif"
      },
      axisY: {
        valueFormatString: "#",
        interval: 1
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
        type: "stackedBar",
        name: "Quantidade total de entregas por bairro",
        showInLegend: "true",
        color: "#edae49",
        dataPoints: this.contarStatusPorMotorista(this.deliveries)?.bairrosTotalEntrega

      },
      {
        type: "stackedBar",
        name: "Quantidade total de entregas feitas por bairro",
        showInLegend: "true",
        color: "#006A4E",
        dataPoints: this.contarStatusPorMotorista(this.deliveries)?.bairrosTotalEntregaFeitas

      }]
    }
  }

  contarStatusPorMotorista(entregas: Deliveries) {

    const resultado: ResultModel[] = [];
    const dataPointsStatusPending: DataPointsModel[] = [];
    const dataPointsStatusDelivered: DataPointsModel[] = [];
    const dataPointsStatusInsuccess: DataPointsModel[] = [];
    const dataPointsByNeighborhoodDeliveredTotal: DataPointsModel[] = [];
    const dataPointsByNeighborhoodDeliveriesMade: DataPointsModel[] = [];

    for (const entrega of entregas) {
      const { nome } = entrega.motorista;
      const status = entrega.status_entrega;
      const bairro = entrega.cliente_destino.bairro;

      let motorista = resultado.find(m => m.nome === nome);

      if (!motorista) {
        motorista = { nome, bairro, totalPendente: 0, totalEntregue: 0, totalInsucesso: 0 };
        resultado.push(motorista);
      }

      if (status.toLocaleLowerCase().includes('pendente')) {
        motorista.totalPendente++;
      }

      if (status.toLocaleLowerCase().includes('entregue')) {
        motorista.totalEntregue++;
      }

      if (status.toLocaleLowerCase().includes('insucesso')) {
        motorista.totalInsucesso++;
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

      dataPointsByNeighborhoodDeliveredTotal.push({
        label: result.bairro,
        y: result.totalEntregue + result.totalPendente
      });

      dataPointsByNeighborhoodDeliveriesMade.push({
        label: result.bairro,
        y: result.totalEntregue
      });

    })

    console.log(
      {
        pendentes: dataPointsStatusPending,
        entregues: dataPointsStatusDelivered,
        insucessos: dataPointsStatusInsuccess,
        bairrosTotalEntrega: dataPointsByNeighborhoodDeliveriesMade,

      }

    )



    return {
      pendentes: dataPointsStatusPending,
      entregues: dataPointsStatusDelivered,
      insucessos: dataPointsStatusInsuccess,
      bairrosTotalEntrega: dataPointsByNeighborhoodDeliveredTotal,
      bairrosTotalEntregaFeitas: dataPointsByNeighborhoodDeliveriesMade
    }

  }




}
