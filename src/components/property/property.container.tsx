import { PropertyComponent } from './property.component';
import { propertyActions } from './property.action';
import { mortgageActions } from '../mortgage/mortgage.action';
import { StoreState } from '../app/app.store';
import { PropertyState, PropertyAction } from './property.types';
import { connect, Dispatch } from 'react-redux';
import { Mortgage } from '../mortgage/mortgage.model';
import { MortgageState } from '../mortgage/mortgage.types';

export function mapStateToProps({ mortgagesById, propertiesById }: StoreState) {
  return { mortgagesById, propertiesById };
}

export function mapDispatchToProps(dispatch: Dispatch<PropertyAction>) {
  return {
    updateState: (payload: PropertyState) => {
      return dispatch(propertyActions.copy(payload));
    },
    updateMortgage: (payload: Partial<MortgageState>) => {
      return dispatch(mortgageActions.copy(Mortgage.create(payload).state));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyComponent);
