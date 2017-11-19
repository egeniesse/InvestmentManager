import * as React from 'react';
import { PropertyState, PropertiesById } from './property.types';
import { MortgagesById, MortgageState } from '../mortgage/mortgage.types';
import { generateId } from '../../utils';
import MortgageContainer from '../mortgage/mortgage.container';

interface Props {
  id: string;
  propertiesById: PropertiesById;
  mortgagesById: MortgagesById;
  updateState: (payload: PropertyState) => { type: string; payload: PropertyState; };
  createMortgage: (mortgageId: string) => { type: string; payload: MortgageState; };
}

export class PropertyComponent extends React.Component<Props, object> {
  render() {
    const boundCreateMortgage = this.createMortgage.bind(this);
    return (
      <div className="property">
        <div>This is the property Id: {this.props.id}</div>
        <button onClick={boundCreateMortgage}>Create Mortgage</button>
        <div>
        {this.data.mortgageIds.map((mortgageId) => {
          return <MortgageContainer key={mortgageId} id={mortgageId}/>;
        })}
        </div>
      </div>
    );
  }

  createMortgage() {
    const mortgageId: string = generateId('Mortgage');
    this.props.createMortgage(mortgageId);
    this.props.updateState(Object.assign({}, this.data, { mortgageIds: this.data.mortgageIds.concat([mortgageId]) }));
  }

  get data(): PropertyState {
    return this.props.propertiesById[this.props.id];
  }
}