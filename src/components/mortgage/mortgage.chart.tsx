import { Line } from 'react-chartjs-2';
import * as React from 'react';
import { Mortgage } from './mortgage.model';
import { ChartData } from 'chart.js';
import { getChartDataSet } from '../../shared/shared.method';
import * as tinycolor from 'tinycolor2';

interface Props {
    data: Array<Mortgage>;
}
export class MortgageChart extends React.Component<Props, object> {

    constructor(props: Props) {
        super(props);
    }

    get data(): ChartData {
      return {
        labels: this.props.data.map((mortgage, index) => String(index)),
        datasets: [
          getChartDataSet(
            'Total Spent',
            this.props.data.map((mortgage) => mortgage.totalSpent),
            tinycolor('rgba(75,192,192,1)')
          ),
          getChartDataSet(
            'interest Paid',
            this.props.data.map((mortgage) => mortgage.interestPaid),
            tinycolor('red')
          ),
          getChartDataSet(
            'Paid Against Principal',
            this.props.data.map((mortgage) => mortgage.paidAgainstPrincipal),
            tinycolor('green')
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
