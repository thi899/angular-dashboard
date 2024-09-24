import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EndpointEnum } from "./enum/endpoint.enum";
import { Observable } from "rxjs";
import { Deliveries } from "./model/delivery.model";

@Injectable({
    providedIn: 'root'
})

export class DeliveryService {

    constructor(private http: HttpClient) {
        this.getDeliveries();
    }

    getDeliveries(): Observable<Deliveries> {
        return this.http.
            get<Deliveries>(EndpointEnum.URI_API_DELIVERY)
    }

}