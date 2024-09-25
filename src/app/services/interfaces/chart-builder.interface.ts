import { ResultModel } from "src/app/pages/dashboard/models/result.model";
import { Deliveries } from "../model/delivery.model";
import { ChartOptions } from "./chart-options.interface";

export interface IDeliveryService {
    countStatusByDriver(deliveries: Deliveries): ResultModel[];
}

export interface IChartConfigurator {
    createChart(deliveries: Deliveries): ChartOptions;
}