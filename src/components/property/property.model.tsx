import { generateId, round } from '../../utils';
import { PropertyState } from './property.types';
import { Mortgage } from '../mortgage/mortgage.model';

interface ForcastOpts {
  years: number;
  percentRentIncrease: number;
  percentEquityIncrease: number;
}
export class Property {
  state: PropertyState;

  public static create(partialState: Partial<PropertyState>): Property {
    const defaults = {
      id: generateId('Property'),
      propertyValue: 1000000,
      mortgageIds: [],
      monthlyRent: 1000,
      managementFees: 8,
      vacancyLoss: 10,
      minorRepairWithholding: 5,
      majorRemodelWithholding: 5,
      taxes: 10,
      utilities: 100,
      insurance: 100
    };
    return new Property(Object.assign(defaults, partialState));
  }

  constructor(initState: PropertyState) {
    this.state = initState;
  }

  get managementCost(): number {
    return round(this.state.monthlyRent * this.state.managementFees / 100);
  }

  get vacancyCost(): number {
    return round(this.state.monthlyRent * this.state.vacancyLoss / 100);
  }

  get minorRepairCost(): number {
    return round(this.state.monthlyRent * this.state.minorRepairWithholding / 100);
  }

  get majorRemodelCost(): number {
    return round(this.state.monthlyRent * this.state.majorRemodelWithholding / 100);
  }

  mortgageCost(mortgages: Array<Mortgage>): number {
    return mortgages.reduce((total, mortgage) => {
      return round(total += mortgage.monthlyPayment);
    }, 0);
  }

  forcastGains(opts: ForcastOpts): Array<Property> {
    const { years, percentRentIncrease, percentEquityIncrease } = opts;
    let tempProperty = Property.create(this.state);
    const properties: Array<Property> = [Property.create(this.state)];
    for (let i = 0; i < years; i++) {
      const rentIncrease = tempProperty.state.monthlyRent * percentRentIncrease / 100;
      const equityIncrease = tempProperty.state.propertyValue * percentEquityIncrease / 100;
      const updates = {
        monthlyRent: round(rentIncrease + tempProperty.state.monthlyRent, 0),
        propertyValue: round(equityIncrease + tempProperty.state.propertyValue, 0)
      };
      properties.push(Property.create(tempProperty.copy(updates).state));
    }
    return properties;
  }

  copy(partialState: Partial<PropertyState> = {}): Property {
    this.state = Object.assign({}, this.state, partialState);
    return this;
  }
}
