import * as React from 'react';
import { PropertyState, PropertiesById } from './property.types';
import { MortgagesById, MortgageState } from '../mortgage/mortgage.types';
import { Property } from './property.model';
import { generateId } from '../../utils';
import MortgageContainer from '../mortgage/mortgage.container';
import './property.css';

interface Props {
  id: string;
  propertiesById: PropertiesById;
  mortgagesById: MortgagesById;
  updateState: (payload: PropertyState) => { type: string; payload: PropertyState; };
  createMortgage: (mortgageId: string) => { type: string; payload: MortgageState; };
}

interface ComponentState {
  property: Property;
}

export class PropertyComponent extends React.Component<Props, object> {

  state: ComponentState;

  constructor(props: Props) {
    super(props);
    this.state = {
      property: Property.create(this.props.propertiesById[this.props.id])
    };
  }
  render() {
    const boundCreateMortgage = this.createMortgage.bind(this);
    return (
      <div className="property">
        <div className="property-header">
          <button onClick={boundCreateMortgage}>Add Mortgage</button>                    
        </div>
        <div className="mortgage-container">
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
    this.handleChange({ mortgageIds: this.data.mortgageIds.concat([mortgageId])});
  }

  handleChange(partialState: Partial<PropertyState>) {
    this.setState(Object.assign({}, this.state, { property: this.state.property.copy(partialState) }));
    this.submitState();
  }

  submitState() {
    this.props.updateState(Object.assign({}, this.data));
  }

  get data(): PropertyState {
    return this.state.property.state;
  }
}