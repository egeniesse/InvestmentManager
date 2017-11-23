import * as React from 'react';
import { MortgageState, MortgagesById, EventHandler } from './mortgage.types';
import { Mortgage } from './mortgage';
import './mortgage.css'

interface Props {
  id: string;
  mortgagesById: MortgagesById;
  updateState: (payload: MortgageState) => { type: string; payload: MortgageState; };
}

interface ComponentState {
  mortgage: Mortgage;
  editable: boolean;
}

export class MortgageComponent extends React.Component<Props, object> {
  state: ComponentState;
  boundHandlers: EventHandler;
  boundSubmit: () => void;
  boundChangeEditable: () => void;
  boundDelete: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      mortgage: Mortgage.create(this.props.mortgagesById[this.props.id] || { id : this.props.id }),
      editable: false
    };
    this.boundHandlers = Object.keys(this.data).reduce((handlers: {[value: string]: EventHandler}, prop: string) => {
      handlers[prop] = this.handleChange.bind(this, prop);
      return handlers;
    }, {});
    this.boundSubmit = this.handleSubmit.bind(this);
    this.boundChangeEditable = this.changeEditable.bind(this);
    this.boundDelete = this.handleDelete.bind(this);
  }

  get data(): MortgageState {
    return this.state.mortgage.state;
  }

  handleChange(property: string, event: React.ChangeEvent<HTMLInputElement>) {
    const partialState = {}
    partialState[property] = event.currentTarget.value;
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
      editable: this.state.editable ? false : true
    }));
  }

  submitState() {
    this.props.updateState(Object.assign({}, this.data))
  }

  renderComponent() {
    return (
      <div className="mortgage-component">
        <div className="single-mortgage">
        {Object.keys(this.data).filter(prop => prop !== 'id' && prop !== 'isDeleted').map((prop) => {
          return ( 
            <div className="line-item" key= {this.data.id + prop}>
              <span>{prop}:</span>
              {(() => {if (this.state.editable === true) {
                return <input type="text" value={this.data[prop]} onChange={this.boundHandlers[prop]} />
              } else {
                return <span>{this.data[prop]}</span>
              }
              })()}
            </div>
          )
        })}
          <button 
            className="update-mortgage"
            onClick={this.state.editable ? this.boundSubmit : this.boundChangeEditable}
          >{this.state.editable ? "Done" : "Edit"}
          </button>
          <button className="update-mortgage" onClick={this.boundDelete}>Delete</button>
        </div>
      </div>
    );
  }

  render() {
    console.log(this.state.mortgage.monthlyPayment, 'payment')
    return this.data.isDeleted !== true ? this.renderComponent() : <div></div>;
  }
}



