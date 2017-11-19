import { PortfolioComponent } from './portfolio.component';
import { portfolioActions } from './portfolio.action';
import { propertyActions } from '../property/property.action';
import { defaultPropertyState } from '../property/property.defaults';
import { StoreState } from '../app/app.store';
import { PortfolioState, PortfolioAction } from './portfolio.types';
import { connect, Dispatch } from 'react-redux';

export function mapStateToProps({ portfolioState }: StoreState) {
  return { portfolioState };
}

export function mapDispatchToProps(dispatch: Dispatch<PortfolioAction>) {
  return {
    updateState: (payload: PortfolioState) => {
      return dispatch(portfolioActions.copy(payload));
    },
    createProperty: (propertyId: string) => {
      return dispatch(propertyActions.copy(Object.assign({}, defaultPropertyState, { id: propertyId })));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioComponent);
