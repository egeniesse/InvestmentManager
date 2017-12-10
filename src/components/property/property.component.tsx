import * as React from 'react';
import { PropertyState, PropertiesById, PropertySimulatorState } from './property.types';
import { MortgagesById, MortgageState } from '../mortgage/mortgage.types';
import { Property } from './property.model';
import MortgageContainer from '../mortgage/mortgage.container';
import './property.css';
import { PropertyChart } from './property.chart';
import { Mortgage } from '../mortgage/mortgage.model';
import { EventHandler, ViewableField } from '../../shared/shared.types';
import { makeViewableField } from '../../shared/shared.method';
import { PropertySimulator } from './property.simulator';
import { Slider, RaisedButton, TextField } from 'material-ui';
import { Doughnut } from 'react-chartjs-2';

interface Props {
  id: string;
  propertiesById: PropertiesById;
  mortgagesById: MortgagesById;
  updateState: (payload: PropertyState) => { type: string; payload: PropertyState; };
  updateMortgage: (payload: Partial<MortgageState>) => { type: string; payload: MortgageState; };
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

  createMortgage(): void {
    const { payload } = this.props.updateMortgage({ homeValue: this.data.propertyValue });
    this.handleChange({ mortgageIds: this.data.mortgageIds.concat([payload.id]) });
    this.handleSimChange({ mortgages: this.state.simModel.state.mortgages.concat([Mortgage.create(payload)]) });
  }

  handleChange(partialState: Partial<PropertyState>): void {
    this.setState(Object.assign({}, this.state, { model : this.state.model.copy(partialState) }));
    this.submitState();
  }

  handleSlide(property: string, e: React.MouseEvent<{}>, value: number): void {
    const partialState = {};
    partialState[property] = value;
    this.handleChange(partialState);
  }

  handleSimChange(partialState: Partial<PropertySimulatorState>): void {
    this.setState(Object.assign({}, this.state, { simModel: this.state.simModel.copy(partialState) }));
  }

  handleSimSlide(property: string, e: React.MouseEvent<{}>, value: number): void {
    const partialState = {};
    partialState[property] = value;
    this.handleSimChange(partialState);
  }

  handleTextChange(property: string, e: object, newValue: string): void {
    const partialState = {};
    partialState[property] = newValue;
    this.handleChange(partialState);
  }

  get viewableFields(): Array<ViewableField> {
    return [
      makeViewableField('name', 'Name', 'handleTextChange', 'textField'),
      makeViewableField('propertyValue', 'Property Value', 'handleSlide', 'slider', 10000, 2500000, 5000),
      makeViewableField('monthlyRent', 'Rent Price', 'handleSlide', 'slider', 0, 10000, 25),
      makeViewableField('propertyTaxRate', 'Property Tax Rate', 'handleSlide', 'slider', 0, 10, .1),
      makeViewableField('vacancyLoss', 'Vacancy Percent', 'handleSlide', 'slider', 0, 50, 1),
      makeViewableField('managementFees', 'Management Fee Percent', 'handleSlide', 'slider', 0, 50, 1),
      makeViewableField('minorRepairWithholding', 'Repair Withholding Percent', 'handleSlide', 'slider', 0, 50, 1),
      makeViewableField('majorRemodelWithholding', 'Remodel Withholding Percent', 'handleSlide', 'slider', 0, 50, 1),
      makeViewableField('utilities', 'Monthly Utilities Cost', 'handleSlide', 'slider', 0, 3000, 10),
      makeViewableField('insurance', 'Monthly Insurance Cost', 'handleSlide', 'slider', 0, 3000, 10),
      makeViewableField('percentRentIncrease', 'Yearly Rent Increase', 'handleSimSlide', 'slider', 0, 10, .1),
      makeViewableField('extraMonthlyPayment', 'Additional Mortgage Payment', 'handleSlide', 'slider', 0, 5000, 100),
      makeViewableField('years', 'Years to Simulate', 'handleSimSlide', 'slider', 1, 60, 1)
    ];
  }

  get mortgages(): Array<Mortgage> {
    return this.data.mortgageIds.reduce((mortgages: Array<Mortgage>, mortgageId) => {
      return mortgages.concat(Mortgage.create(this.props.mortgagesById[mortgageId]));
    }, []).filter(mortgage => !mortgage.state.isDeleted);
  }

  submitState() {
    this.props.updateState(Object.assign({}, this.data));
    this.mortgages.forEach((mortgage) => {
      this.props.updateMortgage(Object.assign({}, mortgage.state, {
        homeValue: this.data.propertyValue,
        extraMonthlyPayment: this.data.extraMonthlyPayment
      }));
    });
  }

  get data(): PropertyState {
    return Object.assign({}, this.state.model.state, this.state.simModel.state);
  }

  exposeFields(whitelist: Array<string>): JSX.Element {
    const boundTextChange = this.handleTextChange.bind(this, 'name');
    const exposedFields = this.viewableFields.filter(field => whitelist.indexOf(field.propName) !== -1);
    return (
      <div className="property-config">
        {exposedFields.map((field) => {
          return (() => {
            if (field.component === 'textField') {
              return (
                <div className="line-item" key={this.data.id + field.propName}>
                  <div className="line-data">{field.description}</div>
                  <TextField
                    name={this.data.id}
                    style={{ width: '100%'}}
                    onChange={boundTextChange}
                    value={this.data[field.propName]}
                  />
                </div>
              );
            } else {
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
                </div>);
            }
          })();
        })}
      </div>
    );
  }
  get mortgageComponent(): JSX.Element {
    const boundCreateMortgage = this.createMortgage.bind(this);
    const mortgages = this.mortgages.map((mortgage) => {
      return <MortgageContainer key={mortgage.state.id} id={mortgage.state.id}/>;
    });
    return (
      <div>
        {mortgages.length ? mortgages : <RaisedButton label="Create Mortgage" onClick={boundCreateMortgage}/>}
      </div>
    );
  }

  get propertyDashboard(): JSX.Element {
    const propData = this.state.simModel.copy({
      mortgages: this.mortgages,
      property: this.state.model
    }).forecastedGains;

    const expenseData = this.state.simModel.monthlyExpenses;

    return (
      <div className="property-dashboard">
        <div className="stat major-stat">
          <PropertyChart data={propData} />
        </div>
        <div className="stat minor-stat">
          <Doughnut data={expenseData} />
        </div>
        <div className="stat minor-stat">
          <Doughnut data={expenseData} />
        </div>
      </div>
    );
  }

  get propertyConfigComponent(): JSX.Element {
    const exposedFields = [
      'years',
      'propertyValue',
      'monthlyRent',
      'vacancyLoss',
      'managementFees',
      'minorRepairWithholding',
      'majorRemodelWithholding',
      'utilities',
      'insurance',
      'propertyTaxRate',
      'percentRentIncrease',
      'name'
    ];
    if (this.mortgages.length) {
      exposedFields.push('extraMonthlyPayment');
    }
    return (
      <div className="property-content">
        <div>
          {this.exposeFields(exposedFields)}
          {this.mortgageComponent}
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="property-component">
        {this.propertyConfigComponent}
        {this.propertyDashboard}
      </div>
    );
  }
}
