import * as React from 'react';
import { MortgageState, MortgagesById } from './mortgage.types';
import { defaultMortgageState } from './mortgage.defaults';

interface Props {
  id: string;
  mortgagesById: MortgagesById;
  updateState: (payload: MortgageState) => { type: string; payload: MortgageState; };
}

export class MortgageComponent extends React.Component<Props, object> {
  render() {
    return (
      <div className="mortgage-ui">
        <span>Name: {this.data.name}, Id: {this.data.id}</span>
      </div>
    );
  }

  get data(): MortgageState {
    return this.props.mortgagesById[this.props.id] || defaultMortgageState;
  }
}