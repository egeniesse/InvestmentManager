import * as React from 'react';
import { PropertyState, PropertiesById } from './property.types';
import { MortgagesById, MortgageState } from '../mortgage/mortgage.types';
import { generateId } from '../../utils';
import MortgageContainer from '../mortgage/mortgage.container';

interface Props {
  id: string,
  propertiesById: PropertiesById,
  mortgagesById: MortgagesById,
  updateState: (payload: PropertyState) => { type: string; payload: PropertyState; };
  createMortgage: (mortgageId: string) => { type: string; payload: MortgageState; };
}

export class PropertyComponent extends React.Component<Props, object> {
  render() {
    return (
      <div className="property">
        <button onClick={this.createMortgage.bind(this)}>Create Mortgage</button>
        <div>
        {this.data.mortgageIds.map((mortgageId) => {
          return <MortgageContainer key={mortgageId} id={mortgageId}/>;
        })}
        </div>
        This is the property
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