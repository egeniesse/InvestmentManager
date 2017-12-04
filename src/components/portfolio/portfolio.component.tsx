import * as React from 'react';
import { PortfolioState } from './portfolio.types';
import { PropertiesById, PropertyState } from '../property/property.types';
import { generateId } from '../../shared/shared.method';
import './portfolio.css';
import PropertyContainer from '../property/property.container';
import { AppBar, IconButton, IconMenu, MenuItem } from 'material-ui';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';

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
    const boundCreateProperty = this.createProperty.bind(this);
    const boundSetActiveProperty = this.setActiveProperty.bind(this);
    return (
      <div className="portfolio">
        <AppBar
          iconElementLeft={
            <IconMenu
              iconButtonElement={<IconButton><NavigationMenu/></IconButton>}
            >
              <MenuItem primaryText="Create Property" onClick={boundCreateProperty} />
              {(() => {
                return this.data.propertyIds.map((propertyId) => {
                  const propName = this.props.propertiesById[propertyId].id;
                  const setAsActiveProperty = boundSetActiveProperty(propertyId);
                  return <MenuItem key={propName} primaryText={propName} onClick={setAsActiveProperty}/>;
                });
              })()}
            </IconMenu>
          }
          title="Portfolio"
        />
        <div className="properties">
        {this.state.activeProperty.map((propertyId) => {
          return <PropertyContainer key={propertyId} id={propertyId}/>;
        })}
        </div>
      </div>
    );
  }
  setActiveProperty(propertyId: string): () => void {
    return () => {
      this.setState(Object.assign({}, this.state, {
        activeProperty: [propertyId]
      }));
    };
  }
  createProperty(): void {
    const { payload } = this.props.createProperty(generateId('Property'));
    this.props.updateState(Object.assign({}, this.data, { propertyIds: this.data.propertyIds.concat([payload.id]) }));
    this.setState(Object.assign({}, this.state, {
      propertyIds: this.data.propertyIds,
      activeProperty: [payload.id]
    }));
  }

  get data(): PortfolioState {
    return this.props.portfolioState;
  }
}