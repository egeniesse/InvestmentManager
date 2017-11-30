import { Line } from 'react-chartjs-2';
import * as React from 'react';
import { ChartData } from 'chart.js';
import { getChartDataSet } from '../../shared/shared.method';
import * as tinycolor from 'tinycolor2';

interface Props {
  data: Array<PropertyChartData>;
}

export interface PropertyChartData {
  monthlyRent: number;
  cashFlow: number;
  minorRepairCost: number;
}

export class PropertyChart extends React.Component<Props, object> {

  constructor(props: Props) {
    super(props);
  }

  get data(): ChartData {
    return {
      labels: this.props.data.map((property, index) => String(index)),
      datasets: [
        getChartDataSet(
          'Rent Charged',
          this.props.data.map((property) => property.monthlyRent),
          tinycolor('rgba(75,192,192,1)')
        ),
        getChartDataSet(
          'Cash Flow',
          this.props.data.map((property) => property.cashFlow),
          tinycolor('green')
        ),
        getChartDataSet(
          'Breaking Even',
          this.props.data.map((property) => 0),
          tinycolor('red')
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