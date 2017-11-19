import { PropertyComponent } from './property.component';
import { propertyActions } from './property.action';
import { mortgageActions } from '../mortgage/mortgage.action';
import { defaultMortgageState } from '../mortgage/mortgage.defaults';
import { StoreState } from '../app/app.store';
import { PropertyState, PropertyAction } from './property.types';
import { connect, Dispatch } from 'react-redux';

export function mapStateToProps({ mortgagesById, propertiesById }: StoreState) {
  return { mortgagesById, propertiesById };
}

export function mapDispatchToProps(dispatch: Dispatch<PropertyAction>) {
  return {
    updateState: (payload: PropertyState) => {
      return dispatch(propertyActions.copy(payload));
    },
    createMortgage: (mortgageId: string) => {
      return dispatch(mortgageActions.copy(Object.assign({}, defaultMortgageState, { id: mortgageId })));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyComponent);
