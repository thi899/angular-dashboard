export interface ChartOptions {
    animationEnabled?: boolean;
    exportEnabled?: boolean;
    title: {
      text: string;
      fontFamily?: string;
    };
    axisY?: {
        valueFormatString: "#",
        interval: 1
      },
    toolTip?: {
      shared: boolean;
    };
    legend?: {
      cursor: string;
      itemclick: (e: any) => void; // Pode ser ajustado para um tipo mais específico, se necessário
    };
    data: ChartDataPoint[];
  }

  interface ChartDataPoint {
    color?: string;
    type: string;
    name?: string;
    legendText?: string;
    showInLegend?: boolean;
    axisYType?: string; // Propriedade opcional
    dataPoints: DataPoint[];
  }
  
  interface DataPoint {
    label: string;
    y?: number | undefined;
  }