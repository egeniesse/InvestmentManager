import { Line } from 'react-chartjs-2';
import * as React from 'react';
import { ChartData } from 'chart.js';
import { getChartDataSet } from '../../shared/shared.method';
import * as tinycolor from 'tinycolor2';

interface Props {
  data: Array<PropertyChartData>;
}

export interface PropertyChartData {
  investment: number;
  totalCashFlow: number;
  totalOperatingCost: number;
  windowOperatingCost: number;
  windowCashFlow: number;
  windowCashOverCash: number;
}

export class PropertyChart extends React.Component<Props, object> {

  constructor(props: Props) {
    super(props);
  }

  get data(): ChartData {
    return {
      labels: this.props.data.map((data, index) => String(index + 1)),
      datasets: [
        getChartDataSet(
          'Cash Over Cash',
          this.props.data.map((data) => {
            return data.windowCashOverCash;
          }),
          tinycolor('rgba(75,192,192,1)')
        ),
        getChartDataSet(
          'Cash Flow',
          this.props.data.map((data) => data.windowCashFlow),
          tinycolor('green')
        ),
        getChartDataSet(
          'Operating Cost',
          this.props.data.map((data) => data.windowOperatingCost),
          tinycolor('orange')
        ),
        getChartDataSet(
          'Money Made',
          this.props.data.map((data) => data.totalCashFlow),
          tinycolor('purple')
        )
      ]
    };
  }

  render() {
    return (
      <Line data={this.data} />
    );
  }
}