import { Mortgage } from '../mortgage/mortgage.model';
import { Property } from './property.model';
import { PropertySimulatorState } from './property.types';
import { PropertyChartData } from './property.chart';
import { round } from '../../shared/shared.method';
import { ChartData } from 'chart.js';
import {
  blue300, brown300,
  green300, orange300, purple300,
  red300, teal300, yellow300
} from 'material-ui/styles/colors';

interface MonthlyData {
  cost: number;
  revenue: number;
}
export class PropertySimulator {

  state: PropertySimulatorState;

  public static create(partialState: Partial<PropertySimulatorState>): PropertySimulator {
    return new PropertySimulator(partialState);
  }

  constructor(partialState: Partial<PropertySimulatorState>) {
    this.state = Object.assign({
      years: 40,
      percentRentIncrease: 3,
      percentEquityIncrease: 3,
      granularity: 12,
      property: Property.create({}),
      mortgages: []
    }, partialState);
  }

  get forecastedMonthlyData(): Array<MonthlyData> {
    let tempSimulator = PropertySimulator.create(this.state).copy({
      mortgages: this.mortgages
    });
    const propertyData: Array<MonthlyData> = [];
    for (let y = 0; y < tempSimulator.state.years; y++) {
      for (let i = 0; i < 12; i++) {
        propertyData.push(tempSimulator.monthlyData);
        tempSimulator.copy({
          mortgages: tempSimulator.state.mortgages.map((mortgage) => {
            return Mortgage.create(mortgage.state).makePayment();
          })
        });
      }
      const rentIncrease = tempSimulator.state.property.monthlyRent * tempSimulator.state.percentRentIncrease / 100;
      const propertyUpdates = { monthlyRent: round(rentIncrease + tempSimulator.state.property.monthlyRent, 0) };
      tempSimulator.copy({
        property: Property.create(Object.assign({}, tempSimulator.state.property.state, propertyUpdates))
      });
    }
    return propertyData;
  }

  get forecastedGains(): Array<PropertyChartData> {
    const investment = round(this.mortgages.reduce((accum, mortgage) => {
      return accum + mortgage.downPaymentTotal + mortgage.state.closingCosts;
    }, 0)) || this.state.property.state.propertyValue;
    let chartData: PropertyChartData = {
      investment: investment,
      totalCashFlow: 0,
      totalOperatingCost: 0,
      windowCashOverCash: 0,
      windowOperatingCost: 0,
      windowCashFlow: 0
    };
    const results: Array<PropertyChartData> = [];
    this.forecastedMonthlyData.forEach((data, index) => {
      chartData = Object.assign({}, chartData, {
        totalCashFlow: round(chartData.totalCashFlow + data.revenue - data.cost),
        totalOperatingCost: round(chartData.totalOperatingCost + data.cost),
        windowOperatingCost: round(chartData.windowOperatingCost + data.cost),
        windowCashFlow: round(chartData.windowCashFlow + data.revenue - data.cost)
      });
      if ((index + 1) % this.state.granularity === 0) {
        results.push(Object.assign({}, chartData, {
          windowCashOverCash: round(chartData.windowCashFlow / investment * 100)
        }));
        chartData.windowOperatingCost = 0;
        chartData.windowCashFlow = 0;
      }
    });
    return results;
  }

  get monthlyExpenses(): ChartData {
    return {
      labels: [
        'Vacancy Cost',
        'Management Cost',
        'Minor Repairs',
        'Major Remodels',
        'Property Tax',
        'Utilities',
        'Insurance',
        'Mortgage Payment'
      ],
      datasets: [{
        data: [
          this.state.property.vacancyCost,
          this.state.property.managementCost,
          this.state.property.minorRepairCost,
          this.state.property.majorRemodelCost,
          this.state.property.monthlyTax,
          this.state.property.state.utilities,
          this.state.property.state.insurance,
          this.mortgages.reduce((payment, mortgage) => {
            return payment + mortgage.monthlyPayment;
          }, 0)
        ],
        backgroundColor: [ red300, green300, yellow300, blue300, purple300, orange300, brown300, teal300]
      }]
    };
  }

  get monthlyData(): MonthlyData {
    return {
      revenue: this.state.property.monthlyRent,
      cost: this.state.property.monthlyCost(this.state.mortgages)
    };
  }

  get mortgages(): Array<Mortgage> {
    return this.state.mortgages.filter(mortgage => !mortgage.state.isDeleted);
  }

  copy(partialState: Partial<PropertySimulatorState> = {}): PropertySimulator {
    this.state = Object.assign({}, this.state, partialState);
    return this;
  }

}