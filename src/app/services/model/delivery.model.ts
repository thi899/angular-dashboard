
interface Driver {
    nome: string;
  }
  
  interface Customer {
    nome: string;
    endereco: string;
    bairro: string;
    cidade: string;
  }
  
  export interface Delivery {
    id: string;
    documento: string;
    motorista: Driver;
    cliente_origem: Customer;
    cliente_destino: Customer;
    status_entrega: string;
  }

  export type Deliveries = Delivery[];
  