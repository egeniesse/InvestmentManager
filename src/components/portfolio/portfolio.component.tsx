import * as React from 'react';
import { PortfolioState } from './portfolio.types';
import { PropertyState } from '../property/property.types';
import { generateId } from '../../utils';
import PropertyContainer from '../property/property.container';

interface Props {
  portfolioState: PortfolioState;
  updateState: (payload: PortfolioState) => { type: string; payload: PortfolioState; };
  createProperty: (propertyId: string) => { type: string; payload: PropertyState; };
}

export class PortfolioComponent extends React.Component<Props, object> {
  render() {
    const boundCreateProperty = this.createProperty.bind(this);
    return (
      <div className="portfolio">
        <button onClick={boundCreateProperty}>Create Property</button>
        <div>
        {this.data.propertyIds.map((propertyId) => {
          return <PropertyContainer key={propertyId} id={propertyId}/>;
        })}
        </div>
      </div>
    );
  }

  createProperty() {
    const propertyId: string = generateId('Property');
    this.props.createProperty(propertyId);
    this.props.updateState(Object.assign({}, this.data, { propertyIds: this.data.propertyIds.concat([propertyId]) }));
  }

  get data(): PortfolioState {
    return this.props.portfolioState;
  }
}