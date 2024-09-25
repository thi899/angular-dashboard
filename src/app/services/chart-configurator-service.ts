import { Injectable } from "@angular/core";
import { Deliveries } from "./model/delivery.model";
import { ChartOptions } from "./interfaces/chart-options.interface";
import { ChartBuilderService } from "./chart-builder.service";

@Injectable({
    providedIn: 'root'
})

export class ChartConfiguratorService {

    constructor(private chartBuilderService: ChartBuilderService) { }

    createFirstVisionChart(deliveries: Deliveries): ChartOptions {
        return {
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
                dataPoints: this.chartBuilderService.countStatusByDriver(deliveries)?.entregues
            }, {
                color: '#FFC72C',
                type: "column",
                name: "Pendentes",
                legendText: "Pendentes",
                axisYType: "secondary",
                showInLegend: true,
                dataPoints: this.chartBuilderService.countStatusByDriver(deliveries)?.pendentes
            }]
        }
    }

    createSecondVisionChart(deliveries: Deliveries): ChartOptions {
       return {
        title: {
          text: "Entregas sem sucesso por motorista",
        },
        data: [{
          color: "#D2122E",
          type: "column",
          dataPoints: this.chartBuilderService.countStatusByDriver(deliveries)?.insucessos
        }]
      };
    }

    createThirdVisionChart(deliveries: Deliveries): ChartOptions {
        return {
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
              showInLegend: true,
              color: "#edae49",
              dataPoints: this.chartBuilderService.countStatusByDriver(deliveries)?.bairrosTotalEntrega
      
            },
            {
              type: "stackedBar",
              name: "Quantidade total de entregas feitas por bairro",
              showInLegend: true,
              color: "#006A4E",
              dataPoints: this.chartBuilderService.countStatusByDriver(deliveries)?.bairrosTotalEntregaFeitas
      
            }]
          }
    }
}

