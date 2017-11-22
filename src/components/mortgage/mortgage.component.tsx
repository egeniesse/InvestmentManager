import * as React from 'react';
import { MortgageState, MortgagesById, EventHandler } from './mortgage.types';
import { defaultMortgageState } from './mortgage.defaults';
import './mortgage.css'

interface Props {
  id: string;
  mortgagesById: MortgagesById;
  updateState: (payload: MortgageState) => { type: string; payload: MortgageState; };
}

export class MortgageComponent extends React.Component<Props, object> {
  state: MortgageState;
  boundHandlers: EventHandler;
  boundSubmit: () => void;

  constructor(props: Props) {
    super(props);
    this.state = this.data;
    this.boundHandlers = Object.keys(this.state).reduce((handlers: {[value: string]: EventHandler}, prop: string) => {
      handlers[prop] = this.handleChange.bind(this, prop);
      return handlers;
    }, {});
    this.boundSubmit = this.handleSubmit.bind(this);
  }

  get data(): MortgageState {
    return this.props.mortgagesById[this.props.id] || defaultMortgageState;
  }

  handleChange(property: string, event: React.ChangeEvent<HTMLInputElement>) {
    const copyState = Object.assign({}, this.state)
    copyState[property] = event.currentTarget.value;
    this.setState(copyState)
  }

  handleSubmit() {
    this.props.updateState(this.state);
  }

  render() {
    return (
      <div className="mortgage-component">
        <div className="single-mortgage">
        {Object.keys(this.state).filter(prop => prop !== 'id').map((prop) => {
          return ( 
            <div className="line-item" key= {this.state.id + prop}>
              <span>{prop}:</span>
              <input type="text" value={this.state[prop]} onChange={this.boundHandlers[prop]} />
            </div>
          )
        })}
          <button className="update-mortgage" onClick={this.boundSubmit}>Submit</button>
        </div>
      </div>
    );
  }
}
