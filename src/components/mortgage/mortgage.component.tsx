import * as React from 'react';
import { MortgageState, MortgagesById } from './mortgage.types';
import { Mortgage } from './mortgage.model';
import Slider from 'material-ui/Slider';
import './mortgage.css';
import { EventHandler, ViewableField } from '../../shared/shared.types';
import { makeViewableField } from '../../shared/shared.method';
import { RaisedButton } from 'material-ui';

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
    handlers[field.propName] = this[field.method].bind(this, field.propName);
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
      makeViewableField('downPayment', 'Percent Down Payment', 'handleSlide', 0, 99, 1),
      makeViewableField('interestRate', 'Interest Rate', 'handleSlide', 1, 7, .05),
      makeViewableField('termYears', 'Term Years', 'handleSlide', 15, 30, 15),
      makeViewableField('closingCosts', 'Closing Costs', 'handleSlide', 0, 20000, 100),
      makeViewableField('extraMonthlyPayment', 'Extra Payment', 'handleSlide', 0, 5000, 100)
    ];
  }

  render() {
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
          <RaisedButton label="Delete" onClick={this.boundDelete}/>
        </div>
      </div>
    );
  }
}
