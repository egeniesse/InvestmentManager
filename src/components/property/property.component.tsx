import * as React from 'react';
import { PropertyState, PropertiesById, PropertySimulatorState } from './property.types';
import { MortgagesById, MortgageState } from '../mortgage/mortgage.types';
import { Property } from './property.model';
import { generateId } from '../../shared/shared.method';
import MortgageContainer from '../mortgage/mortgage.container';
import './property.css';
import { PropertyChart } from './property.chart';
import { Mortgage } from '../mortgage/mortgage.model';
import { EventHandler, ViewableField } from '../../shared/shared.types';
import { makeViewableField } from '../../shared/shared.method';
import Slider from 'material-ui/Slider';
import { PropertySimulator } from './property.simulator';

interface Props {
  id: string;
  propertiesById: PropertiesById;
  mortgagesById: MortgagesById;
  updateState: (payload: PropertyState) => { type: string; payload: PropertyState; };
  createMortgage: (mortgageId: string) => { type: string; payload: MortgageState; };
}

interface ComponentState {
  model: Property;
  simModel: PropertySimulator;
}

export class PropertyComponent extends React.Component<Props, object> {

  state: ComponentState;
  boundHandlers: { [prop: string]: EventHandler};

  constructor(props: Props) {
    super(props);
    const property = Property.create(this.props.propertiesById[this.props.id]);
    this.state = {
      model: property,
      simModel: PropertySimulator.create({ property })
    };
    this.boundHandlers = this.viewableFields.reduce((handlers: {string: EventHandler}, field: ViewableField) => {
      handlers[field.propName] = this[field.method].bind(this, field.propName);
      return handlers;
    }, {});
  }

  createMortgage() {
    const { payload } = this.props.createMortgage(generateId('Mortgage'));
    this.handleChange({ mortgageIds: this.data.mortgageIds.concat([payload.id]) });
    this.handleSimChange({ mortgages: this.state.simModel.state.mortgages.concat([Mortgage.create(payload)]) });
  }

  handleChange(partialState: Partial<PropertyState>) {
    this.setState(Object.assign({}, this.state, { model : this.state.model.copy(partialState) }));
    this.submitState();
  }

  handleSlide(property: string, e: React.MouseEvent<{}>, value: number): void {
    const partialState = {};
    partialState[property] = value;
    this.handleChange(partialState);
  }

  handleSimChange(partialState: Partial<PropertySimulatorState>) {
    this.setState(Object.assign({}, this.state, { simModel: this.state.simModel.copy(partialState) }));
  }

  handleSimSlide(property: string, e: React.MouseEvent<{}>, value: number): void {
    const partialState = {};
    partialState[property] = value;
    this.handleSimChange(partialState);
  }

  get viewableFields(): Array<ViewableField> {
    return [
      makeViewableField('propertyValue', 'Property Value', 'handleSlide', 10000, 2000000, 5000),
      makeViewableField('monthlyRent', 'Rent Price', 'handleSlide', 0, 10000, 25),
      makeViewableField('vacancyLoss', 'Vacancy Percent', 'handleSlide', 0, 50, 1),
      makeViewableField('managementFees', 'Management Fee Percent', 'handleSlide', 0, 50, 1),
      makeViewableField('minorRepairWithholding', 'Minor Repair Withholding Percent', 'handleSlide', 0, 50, 1),
      makeViewableField('majorRemodelWithholding', 'Major Remodel Withholding Percent', 'handleSlide', 0, 50, 1),
      makeViewableField('utilities', 'Monthly Utilities Cost', 'handleSlide', 0, 3000, 10),
      makeViewableField('insurance', 'Monthly Insurance Cost', 'handleSlide', 0, 3000, 10),
      makeViewableField('propertyTaxRate', 'Property Tax Rate', 'handleSlide', 0, 10, .1),
      makeViewableField('percentRentIncrease', 'Yearly Rent Increase', 'handleSimSlide', 0, 10, .1),
      makeViewableField('years', 'Years to Simulate', 'handleSimSlide', 0, 60, 1)
    ];
  }

  get mortgages(): Array<Mortgage> {
    return this.data.mortgageIds.reduce((mortgages: Array<Mortgage>, mortgageId) => {
      return mortgages.concat(Mortgage.create(this.props.mortgagesById[mortgageId]));
    }, []);
  }

  submitState() {
    this.props.updateState(Object.assign({}, this.data));
  }

  get data(): PropertyState {
    return Object.assign({}, this.state.model.state, this.state.simModel.state);
  }

  render() {
    const boundCreateMortgage = this.createMortgage.bind(this);
    const propData = this.state.simModel.copy({
      mortgages: this.mortgages,
      property: this.state.model
    }).forecastGains();

    return (
      <div className="property-component">
        <div className="property-header">
          <button onClick={boundCreateMortgage}>Add Mortgage</button>
        </div>
        <div className="property-content">
          <div className="property-config">
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
          </div>
          <div className="property-data">
            <PropertyChart data={propData}/>
          </div>
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
