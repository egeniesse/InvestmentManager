import { connect, Dispatch } from 'react-redux';
import { DrawerComponent } from './drawer.component';
import { StoreState } from '../app/app.store';
import { portfolioActions } from '../portfolio/portfolio.action';
import { PortfolioAction, PortfolioState } from '../portfolio/portfolio.types';
import { propertyActions } from '../property/property.action';
import { PropertyState } from '../property/property.types';

export function mapDispatchToProps(dispatch: Dispatch<PortfolioAction>) {
  return {
    updatePortfolio: (payload: PortfolioState) => {
      return dispatch(portfolioActions.copy(payload));
    },
    updateProperty: (payload: PropertyState) => {
      return dispatch(propertyActions.copy(payload));
    }
  };
}

export function mapStateToProps({ propertiesById, portfolioState }: StoreState) {
  return { propertiesById, portfolioState };
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerComponent);