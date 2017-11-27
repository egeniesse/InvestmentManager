import * as React from 'react';
import { MortgageState, MortgagesById, EventHandler } from './mortgage.types';
import { Mortgage } from './mortgage';
import Slider from 'material-ui/Slider';
import './mortgage.css';
import { MortgageChart } from './mortgage.chart';

interface Props {
  id: string;
  mortgagesById: MortgagesById;
  updateState: (payload: MortgageState) => { type: string; payload: MortgageState; };
}

interface ComponentState {
  mortgage: Mortgage;
  editable: boolean;
}

interface ViewableField {
  description: string;
  propName: string;
  minValue: number;
  maxValue: number;
  step: number;
}

function makeViewableField(
  propName: string,
  description: string,
  minValue: number,
  maxValue: number,
  step: number
): ViewableField {
  return { propName, description, minValue, maxValue, step };
}

export class MortgageComponent extends React.Component<Props, object> {
  state: ComponentState;
  boundHandlers: { [prop: string]: EventHandler};
  boundSubmit: () => void;
  boundChangeEditable: () => void;
  boundDelete: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      mortgage: Mortgage.create(this.props.mortgagesById[this.props.id] || { id : this.props.id }),
      editable: false
    };
    this.boundHandlers = this.viewableFields.reduce((handlers: {string: EventHandler}, field: ViewableField) => {
      handlers[field.propName] = this.handleChange.bind(this, field.propName);
      return handlers;
    }, {});
    this.boundSubmit = this.handleSubmit.bind(this);
    this.boundChangeEditable = this.changeEditable.bind(this);
    this.boundDelete = this.handleDelete.bind(this);
  }

  get data(): MortgageState {
    return this.state.mortgage.state;
  }

  handleChange(property: string, e: React.MouseEvent<{}>, value: number): void {
    const partialState = {};
    partialState[property] = value;
    this.setState(Object.assign({}, this.state, { 
      mortgage: this.state.mortgage.copy(partialState)
    }));
  }

  handleDelete() {
    this.setState(Object.assign({}, this.state, { 
      mortgage: this.state.mortgage.copy({ isDeleted: true })
    }));
    this.submitState();
  }

  handleSubmit() {
    this.changeEditable();
    this.submitState();
  }

  changeEditable() {
    this.setState(Object.assign ({}, this.state, {
      editable: !this.state.editable
    }));
  }

  submitState() {
    this.props.updateState(Object.assign({}, this.data));
  }

  get viewableFields(): Array<ViewableField> {
    return [
      makeViewableField('homeValue', 'Home Value', 10000, 2000000, 5000),
      makeViewableField('downPayment', 'Percent Down Payment', 0, 99, 1),
      makeViewableField('interestRate', 'Interest Rate', 1, 7, .05),
      makeViewableField('termYears', 'Term Years', 15, 30, 15),
      makeViewableField('closingCosts', 'Closing Costs', 0, 20000, 100),
      makeViewableField('additionalMonthlyPayment', 'Additional Monthly Payment', 0, 5000, 50)
    ];
  }

  renderComponent() {
    const forcastedMortgage = this.state.mortgage.forcastRemainingPayments();
    const mortgageDetails = forcastedMortgage.pastStates;
    return (
      <div className="mortgage-component">
        <div className="single-mortgage">
        {this.viewableFields.map((field) => {
          return (
            <div className="line-item" key={this.data.id + field.propName}>
              <div className="line-data">{field.description}: {this.data[field.propName]}</div>
              {this.state.editable === true ?
                <Slider
                  min={field.minValue}
                  max={field.maxValue}
                  sliderStyle={{margin: '5px'}}
                  defaultValue={this.data[field.propName]}
                  step={field.step}
                  onChange={this.boundHandlers[field.propName]}
                /> : <div/>
              }
            </div>
          );
        })}
          <button
            className="update-mortgage"
            onClick={this.state.editable ? this.boundSubmit : this.boundChangeEditable}
          >{this.state.editable ? 'Done' : 'Edit'}
          </button>
          <button className="update-mortgage" onClick={this.boundDelete}>Delete</button>
        </div>
        <div className="mortgage-data">
          <h2>Data</h2>
          <div className="data">Upfront Cost: {this.state.mortgage.downPaymentTotal + this.data.closingCosts}</div>
          <div className="data">Months left: {mortgageDetails.length - 1}</div>
          <div className="data">Monthly Payment: {this.state.mortgage.monthlyPayment}</div>
          <div className="data">Total Paid in Interest: {forcastedMortgage.interestPaid}</div>
          <div className="data">Total Cost: {forcastedMortgage.totalSpent}</div>
          <MortgageChart data={mortgageDetails} />
        </div>
      </div>
    );
  }

  render() {
    return this.data.isDeleted !== true ? this.renderComponent() : <div/>;
  }
}
