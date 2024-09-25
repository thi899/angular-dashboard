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
      itemclick: (e: any) => void;
    };
    data: ChartDataPoint[];
  }

  export interface ChartDataPoint {
    color?: string;
    type: string;
    name?: string;
    legendText?: string;
    showInLegend?: boolean;
    axisYType?: string;
    dataPoints: DataPoint[];
  }
  
  export interface DataPoint {
    label: string;
    y?: number | undefined;
  }