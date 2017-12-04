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
import { Slider, Tab, Tabs, RaisedButton } from 'material-ui';
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

  get viewableFields(): Array<ViewableField> {
    return [
      makeViewableField('propertyValue', 'Property Value', 'handleSlide', 10000, 2000000, 5000),
      makeViewableField('monthlyRent', 'Rent Price', 'handleSlide', 0, 10000, 25),
      makeViewableField('propertyTaxRate', 'Property Tax Rate', 'handleSlide', 0, 10, .1),
      makeViewableField('vacancyLoss', 'Vacancy Percent', 'handleSlide', 0, 50, 1),
      makeViewableField('managementFees', 'Management Fee Percent', 'handleSlide', 0, 50, 1),
      makeViewableField('minorRepairWithholding', 'Minor Repair Withholding Percent', 'handleSlide', 0, 50, 1),
      makeViewableField('majorRemodelWithholding', 'Major Remodel Withholding Percent', 'handleSlide', 0, 50, 1),
      makeViewableField('utilities', 'Monthly Utilities Cost', 'handleSlide', 0, 3000, 10),
      makeViewableField('insurance', 'Monthly Insurance Cost', 'handleSlide', 0, 3000, 10),
      makeViewableField('extraMonthlyPayment', 'Additional Mortgage Payment', 'handleSlide', 0, 5000, 100),
      makeViewableField('percentRentIncrease', 'Yearly Rent Increase', 'handleSimSlide', 0, 10, .1),
      makeViewableField('years', 'Years to Simulate', 'handleSimSlide', 1, 60, 1)
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
    const exposedFields = this.viewableFields.filter(field => whitelist.indexOf(field.propName) !== -1);
    return (
      <div className="property-config">
        {exposedFields.map((field) => {
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
    );
  }
  get mortgageComponent(): JSX.Element {
    const boundCreateMortgage = this.createMortgage.bind(this);
    const mortgages = this.mortgages.map((mortgage) => {
      return <MortgageContainer key={mortgage.state.id} id={mortgage.state.id}/>;
    });
    return (
      <div className="property-tab">
        <div className="mortgage-container">
          {mortgages.length ? mortgages : <RaisedButton label="Create Mortgage" onClick={boundCreateMortgage}/>}
        </div>
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
        <Tabs>
          <Tab label="Monthly Expenses">
          <div className="property-dashboard-tab">
            <Doughnut data={expenseData} />
          </div>
          </Tab>
          <Tab label="Forecast Profitability">
            <div className="property-dashboard-tab">
              {this.exposeFields(['years'])}
              <PropertyChart data={propData} />
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }

  get propertyConfigComponent(): JSX.Element {
    const exposedFields = [
      'propertyValue',
      'monthlyRent',
      'vacancyLoss',
      'managementFees',
      'minorRepairWithholding',
      'majorRemodelWithholding',
      'utilities',
      'insurance',
      'propertyTaxRate',
      'percentRentIncrease'
    ];
    if (this.mortgages.length) {
      exposedFields.push('extraMonthlyPayment');
    }
    return (
      <div className="property-content property-tab">
        {this.exposeFields(exposedFields)}
      </div>
    );
  }
  render() {
    return (
      <div className="property-component">
        {this.propertyDashboard}
        <Tabs>
          <Tab label="Property">
            {this.propertyConfigComponent}
          </Tab>
          <Tab label="Mortgage">
            {this.mortgageComponent}
          </Tab>
        </Tabs>
      </div>
    );
  }
}
