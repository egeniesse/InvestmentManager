import { Mortgage } from '../mortgage/mortgage.model';
import { Property } from './property.model';
import { PropertySimulatorState } from './property.types';
import { PropertyChartData } from './property.chart';
import { round } from '../../shared/shared.method';

export class PropertySimulator {

  state: PropertySimulatorState;

  public static create(partialState: Partial<PropertySimulatorState>): PropertySimulator {
    return new PropertySimulator(partialState);
  }

  constructor(partialState: Partial<PropertySimulatorState>) {
    this.state = Object.assign({}, partialState, {
      years: 40,
      percentRentIncrease: 3,
      percentEquityIncrease: 3,
      property: Property.create({}),
      mortgages: []
    });
  }

  forecastGains(): Array<PropertyChartData> {
    let tempProperty = Property.create(this.state.property.state);
    let mortgages = this.state.mortgages;
    const propertyData: Array<PropertyChartData> = [
      this.getPropertyChartData(tempProperty, round(mortgages.reduce((total, mortgage) => {
        return mortgage.monthlyPayment;
      }, 0)))
    ];
    for (let i = 0; i < this.state.years; i++) {
      let totalMortgageCost = 0;
      for (let y = 0; y < 12; y++) {
        mortgages = mortgages.map((mortgage) => {
          totalMortgageCost += mortgage.monthlyPayment;
          return Mortgage.create(mortgage.state).makePayment();
        });
      }
      propertyData.push(this.getPropertyChartData(tempProperty, round(totalMortgageCost / 12)));
      const rentIncrease = tempProperty.state.monthlyRent * this.state.percentRentIncrease / 100;
      const updates = { monthlyRent: round(rentIncrease + tempProperty.state.monthlyRent, 0) };
      tempProperty = Property.create(tempProperty.copy(updates).state);
    }
    return propertyData;
  }

  getPropertyChartData(property: Property, mortgageCost: number): PropertyChartData {
    return {
      monthlyRent: property.monthlyRent,
      cashFlow: property.cashFlow(mortgageCost),
      minorRepairCost: property.minorRepairCost
    };
  }

  copy(partialState: Partial<PropertySimulatorState> = {}): PropertySimulator {
    this.state = Object.assign({}, this.state, partialState);
    return this;
  }

}