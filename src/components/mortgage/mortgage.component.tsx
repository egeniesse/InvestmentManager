import * as React from 'react';
import { MortgageState, MortgagesById } from './mortgage.types';
import { Mortgage } from './mortgage.model';
import Slider from 'material-ui/Slider';
import './mortgage.css';
import { MortgageChart } from './mortgage.chart';
import { EventHandler, ViewableField } from '../../shared/shared.types';
import { makeViewableField } from '../../shared/shared.method';

interface Props {
  id: string;
  mortgagesById: MortgagesById;
  updateState: (payload: MortgageState) => { type: string; payload: MortgageState; };
}

interface ComponentState {
  model: Mortgage;
}

export class MortgageComponent extends React.Component<Props, object> {
  state: ComponentState;
  boundHandlers = this.viewableFields.reduce((handlers: {string: EventHandler}, field: ViewableField) => {
    handlers[field.propName] = this.handleSlide.bind(this, field.propName);
    return handlers;
  }, {});
  boundDelete = this.handleDelete.bind(this);

  constructor(props: Props) {
    super(props);
    this.state = {
      model: this.model
    };
  }

  get data(): MortgageState {
    return this.state.model.state;
  }

  handleChange(partialState: Partial<MortgageState>) {
    this.setState(Object.assign({}, this.state, { model: this.state.model.copy(partialState) }));
    this.submitState();
  }

  handleDelete() {
    this.setState(Object.assign({}, this.state, { 
      model: this.state.model.copy({ isDeleted: true })
    }));
    this.submitState();
  }

  handleSlide(property: string, e: React.MouseEvent<{}>, value: number): void {
    const partialState = {};
    partialState[property] = value;
    this.handleChange(partialState);
  }

  submitState() {
    this.props.updateState(Object.assign({}, this.data));
  }

  get model(): Mortgage {
    return Mortgage.create(this.props.mortgagesById[this.props.id]);
  }

  get viewableFields(): Array<ViewableField> {
    return [
      makeViewableField('homeValue', 'Home Value', 10000, 2000000, 5000),
      makeViewableField('downPayment', 'Percent Down Payment', 0, 99, 1),
      makeViewableField('interestRate', 'Interest Rate', 1, 7, .05),
      makeViewableField('termYears', 'Term Years', 15, 30, 15),
      makeViewableField('closingCosts', 'Closing Costs', 0, 20000, 100),
      makeViewableField('extraMonthlyPayment', 'Extra Payment', 0, 5000, 100)
    ];
  }

  render() {
    const forcastedMortgage = this.state.model.forcastRemainingPayments();
    const mortgageDetails = forcastedMortgage.pastStates;
    return (
      <div className="mortgage-component">
        <div className="single-mortgage">
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
          <button className="update-mortgage" onClick={this.boundDelete}>Delete</button>
        </div>
        <div className="mortgage-data">
          <h2>Mortgage Data</h2>
          <div className="data">Upfront Cost: {this.state.model.downPaymentTotal + this.data.closingCosts}</div>
          <div className="data">Months left: {mortgageDetails.length - 1}</div>
          <div className="data">Monthly Payment: {this.state.model.monthlyPayment}</div>
          <div className="data">Total Paid in Interest: {forcastedMortgage.interestPaid}</div>
          <div className="data">Total Cost: {forcastedMortgage.totalSpent}</div>
          <MortgageChart data={mortgageDetails} />
        </div>
      </div>
    );
  }
}
