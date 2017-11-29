import { generateId, round } from '../../shared/shared.method';
import { PropertyState } from './property.types';
import { Mortgage } from '../mortgage/mortgage.model';

export class Property {
  state: PropertyState;

  public static create(partialState: Partial<PropertyState>): Property {
    const defaults = {
      id: generateId('Property'),
      propertyValue: 1000000,
      monthlyRent: 1000,
      managementFees: 8,
      vacancyLoss: 10,
      minorRepairWithholding: 5,
      majorRemodelWithholding: 5,
      taxes: 10,
      utilities: 100,
      insurance: 100,
      mortgageIds: []
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

  get monthlyRent(): number {
    return round(this.state.monthlyRent);
  }

  cashFlow(mortgages: Array<Mortgage>): number {
    return round(
      this.monthlyRent -
      this.vacancyCost -
      this.managementCost -
      this.minorRepairCost -
      this.majorRemodelCost -
      this.mortgageCost(mortgages)
    );
  }

  mortgageCost(mortgages: Array<Mortgage>): number {
    return mortgages.reduce((total, mortgage) => {
      return round(total + mortgage.monthlyPayment);
    }, 0);
  }

  copy(partialState: Partial<PropertyState> = {}): Property {
    this.state = Object.assign({}, this.state, partialState);
    return this;
  }
}
