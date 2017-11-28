import { Line } from 'react-chartjs-2';
import * as React from 'react';
import { Mortgage } from './mortgage.model';
import { ChartData } from 'chart.js';

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
          {
            label: 'Total Spent',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.props.data.map((mortgage) => mortgage.totalSpent)
          },
          {
            label: 'Interest Paid',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'red',
            borderColor: 'red',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'red',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'red',
            pointHoverBorderColor: 'red',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.props.data.map((mortgage) => mortgage.interestPaid)
          },
          {
            label: 'Paid Against Principal',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'green',
            borderColor: 'green',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'green',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'green',
            pointHoverBorderColor: 'green',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.props.data.map((mortgage) => mortgage.paidAgainstPrincipal)
          }
        ]
      };
    }

    render() {
      return (
        <Line data={this.data} />
      );
    }
}
