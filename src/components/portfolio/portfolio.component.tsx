import * as React from 'react';
import { PortfolioState } from './portfolio.types';
import { PropertiesById, PropertyState } from '../property/property.types';
import './portfolio.css';
import PropertyContainer from '../property/property.container';

interface Props {
  portfolioState: PortfolioState;
  propertiesById: PropertiesById;
  updateState: (payload: PortfolioState) => { type: string; payload: PortfolioState; };
  createProperty: (propertyId: string) => { type: string; payload: PropertyState; };
}

export class PortfolioComponent extends React.Component<Props, object> {
  state: PortfolioState;

  constructor(props: Props) {
    super(props);
    this.state = {
      propertyIds: [],
      activeProperty: []
    };
  }

  render() {
    return (
      <div className="portfolio">
        {this.data.activeProperty.map((propertyId) => {
          return <PropertyContainer key={propertyId} id={propertyId}/>;
        })}
      </div>
    );
  }

  get data(): PortfolioState {
    return this.props.portfolioState;
  }
}