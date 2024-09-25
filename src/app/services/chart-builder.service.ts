import { Injectable } from "@angular/core";
import { Deliveries } from "./model/delivery.model";
import { ResultModel } from "../pages/dashboard/models/result.model";
import { StatusEnum } from "../pages/dashboard/enum/status.enum";
import { DataPointsModel } from "../pages/dashboard/models/datapoints.model";

@Injectable({
    providedIn: 'root',
  })
  export class ChartBuilderService {
    
    countStatusByDriver(entregas: Deliveries) {

      const result: ResultModel[] = [];
  
      for (const entrega of entregas) {
        const { nome } = entrega.motorista;
        const status = entrega.status_entrega;
        const bairro = entrega.cliente_destino.bairro;
  
        let driver = result.find(m => m.nome === nome);
  
        if (!driver) {
          driver = { nome, bairro, totalPendente: 0, totalEntregue: 0, totalInsucesso: 0 };
          result.push(driver);
        }
  
        if (status.toLocaleLowerCase().includes(StatusEnum.PENDING.toLocaleLowerCase())) {
          driver.totalPendente++;
        }
  
        if (status.toLocaleLowerCase().includes(StatusEnum.DELIVERED.toLocaleLowerCase())) {
          driver.totalEntregue++;
        }
  
        if (status.toLocaleLowerCase().includes(StatusEnum.INSUCCESS.toLocaleLowerCase())) {
          driver.totalInsucesso++;
        }
      }
  
      return this.resultChartsVisions(result);
    }
  
    resultChartsVisions(result: ResultModel[]) {
      const dataPointsStatusPending: DataPointsModel[] = [];
      const dataPointsStatusDelivered: DataPointsModel[] = [];
      const dataPointsStatusInsuccess: DataPointsModel[] = [];
      const dataPointsByNeighborhoodDeliveredTotal: DataPointsModel[] = [];
      const dataPointsByNeighborhoodDeliveriesMade: DataPointsModel[] = [];
  
      result.map((result) => {
  
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
  
      });
  
      return {
        pendentes: dataPointsStatusPending,
        entregues: dataPointsStatusDelivered,
        insucessos: dataPointsStatusInsuccess,
        bairrosTotalEntrega: dataPointsByNeighborhoodDeliveredTotal,
        bairrosTotalEntregaFeitas: dataPointsByNeighborhoodDeliveriesMade
      }
    }
  
  }