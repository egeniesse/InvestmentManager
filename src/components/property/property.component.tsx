import * as React from 'react';
import { PropertyState, PropertiesById } from './property.types';
import { MortgagesById, MortgageState } from '../mortgage/mortgage.types';
import { Property } from './property.model';
import { generateId, round } from '../../shared/shared.method';
import MortgageContainer from '../mortgage/mortgage.container';
import './property.css';
import { PropertyChart, PropertyChartData } from './property.chart';
import { Mortgage } from '../mortgage/mortgage.model';
import { EventHandler, ViewableField } from '../../shared/shared.types';
import { makeViewableField } from '../../shared/shared.method';
import Slider from 'material-ui/Slider';

interface Props {
  id: string;
  propertiesById: PropertiesById;
  mortgagesById: MortgagesById;
  updateState: (payload: PropertyState) => { type: string; payload: PropertyState; };
  createMortgage: (mortgageId: string) => { type: string; payload: MortgageState; };
}

interface ForcastOpts {
  years: number;
  percentRentIncrease: number;
  percentEquityIncrease: number;
}

interface ComponentState {
  model: Property;
}

export class PropertyComponent extends React.Component<Props, object> {

  state: ComponentState;
  boundHandlers: { [prop: string]: EventHandler};

  constructor(props: Props) {
    super(props);
    this.state = {
      model: Property.create(this.props.propertiesById[this.props.id])
    };
    this.boundHandlers = this.viewableFields.reduce((handlers: {string: EventHandler}, field: ViewableField) => {
      handlers[field.propName] = this.handleSlide.bind(this, field.propName);
      return handlers;
    }, {});
  }

  createMortgage() {
    const { payload } = this.props.createMortgage(generateId('Mortgage'));
    this.handleChange({ mortgageIds: this.data.mortgageIds.concat([payload.id])});
  }

  handleChange(partialState: Partial<PropertyState>) {
    this.setState(Object.assign({}, this.state, { property: this.state.model.copy(partialState) }));
    this.submitState();
  }

  handleSlide(property: string, e: React.MouseEvent<{}>, value: number): void {
    const partialState = {};
    partialState[property] = value;
    this.handleChange(partialState);
  }

  get viewableFields(): Array<ViewableField> {
    return [
      makeViewableField('monthlyRent', 'Rent Price', 0, 4000, 10)
    ];
  }

  get mortgages(): Array<Mortgage> {
    return this.data.mortgageIds.reduce((mortgages: Array<Mortgage>, mortgageId) => {
      return mortgages.concat(Mortgage.create(this.props.mortgagesById[mortgageId]));
    }, []);
  }

  forcastGains(opts: ForcastOpts): Array<PropertyChartData> {
    const { years, percentRentIncrease, percentEquityIncrease } = opts;
    let tempProperty = Property.create(this.data);
    let mortgages = this.mortgages;
    const properties: Array<PropertyChartData> = [this.getPropertyChartData(tempProperty, mortgages)];
    for (let i = 0; i < years * 12; i++) {
      const rentIncrease = tempProperty.state.monthlyRent * percentRentIncrease / 1200;
      const equityIncrease = tempProperty.state.propertyValue * percentEquityIncrease / 1200;
      const updates = {
        monthlyRent: round(rentIncrease + tempProperty.state.monthlyRent, 0),
        propertyValue: round(equityIncrease + tempProperty.state.propertyValue, 0)
      };
      tempProperty = Property.create(tempProperty.copy(updates).state);
      mortgages = mortgages.map((mortgage) => Mortgage.create(mortgage.makePayment().state));
      properties.push(this.getPropertyChartData(tempProperty, mortgages));
    }
    return properties;
  }

  getPropertyChartData(property: Property, mortgages: Array<Mortgage>): PropertyChartData {
    return {
      monthlyRent: property.monthlyRent,
      cashFlow: property.cashFlow(mortgages),
      minorRepairCost: property.minorRepairCost
    };
  }

  submitState() {
    this.props.updateState(Object.assign({}, this.data));
  }

  get data(): PropertyState {
    return this.state.model.state;
  }

  render() {
    const boundCreateMortgage = this.createMortgage.bind(this);
    const opts = { years: 10, percentRentIncrease: 5, percentEquityIncrease: 6 };
    const propData = this.forcastGains(opts);
    return (
      <div className="property">
        {this.viewableFields.map((field) => {
          return (
            <div className="line-item" key={this.data.id + field.propName}>
              <div className="line-data">{field.description}: {this.data[field.propName]}</div>
              <Slider
                min={field.minValue}
                max={field.maxValue}
                sliderStyle={{margin: '5px'}}
                defaultValue={this.data[field.propName]}
                step={field.step}
                onChange={this.boundHandlers[field.propName]}
              />
            </div>
          );
        })}
        <PropertyChart data={propData}/>
        <div className="property-header">
          <button onClick={boundCreateMortgage}>Add Mortgage</button>
        </div>
        <div className="mortgage-container">
        {this.mortgages.filter(mortgage => !mortgage.state.isDeleted).map((mortgage) => {
          return <MortgageContainer key={mortgage.state.id} id={mortgage.state.id}/>;
        })}
        </div>
      </div>
    );
  }
}
