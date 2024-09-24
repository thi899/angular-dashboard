import { Injectable } from "@angular/core";
import { Deliveries } from "../model/delivery.model";
import { BehaviorSubject, Observable, Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class DeliveriesStateService {

    private deliveries$: Subject<Deliveries> = new BehaviorSubject<Deliveries>([]);

    getDeliveries(): Observable<Deliveries> {
        return this.deliveries$.asObservable();
    }

    setDeliveries(deliveries: Deliveries): void {
        this.deliveries$.next(deliveries);
    }
    
}