import * as React from 'react';
import { Drawer, List, ListItem } from 'material-ui';
import { PropertiesById, PropertyState } from '../property/property.types';
import { PortfolioState } from '../portfolio/portfolio.types';
import { Property } from '../property/property.model';

interface Props {
  propertiesById: PropertiesById;
  portfolioState: PortfolioState;
  updatePortfolio: (payload: PortfolioState) => { type: string; payload: PortfolioState; };
  updateProperty: (payload: PropertyState) => { type: string; payload: PropertyState; };
}

interface NavigatorState {
  page: string;
}

export class DrawerComponent extends React.Component<Props, object> {
  state: NavigatorState;
  boundOptions: { [page: string]: () => {} };

  constructor(props: Props) {
    super(props);
    this.state = { page: 'property' };
    this.boundOptions = {
      property: this.propertyPage.bind(this)
    };
  }

  navigateToProperty(propertyId: string) {
    this.props.updatePortfolio(Object.assign({}, this.props.portfolioState, {
      activeProperty: [propertyId]
    }));
  }

  createProperty() {
    const { payload } = this.props.updateProperty(Property.create({}).state);
    this.props.updatePortfolio(Object.assign({}, this.props.portfolioState, {
      propertyIds: this.props.portfolioState.propertyIds.concat([payload.id]),
      activeProperty: [payload.id]
    }));
  }

  listProperies() {
    return this.props.portfolioState.propertyIds.map((propertyId) => {
      const boundNavigate = this.navigateToProperty.bind(this, propertyId);
      return (
        <ListItem
          key={propertyId}
          primaryText={this.props.propertiesById[propertyId].name}
          onClick={boundNavigate}
        />
      );
    });
  }

  propertyPage() {
    const boundListProperties = this.listProperies.bind(this);
    const boundCreateProperty = this.createProperty.bind(this);
    return (
      <List>
        <ListItem primaryText="Create Property" onClick={boundCreateProperty}/>
        <ListItem
          primaryText="Properties"
          initiallyOpen={true}
          nestedItems={boundListProperties()}
        />
      </List>
    );
  }

  render() {
    return (
      <Drawer containerStyle={{ margin: '64px 0 0 0', width: '200px'}}>
        {this.boundOptions[this.state.page]()}
      </Drawer>
    );
  }
}