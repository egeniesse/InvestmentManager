import { MortgageComponent } from './mortgage.component';
import { mortgageActions } from './mortgage.action';
import { StoreState } from '../app/app.store';
import { MortgageState, MortgageAction } from './mortgage.types';
import { connect, Dispatch } from 'react-redux';

export function mapStateToProps({ mortgagesById }: StoreState) {  
  return { mortgagesById };
}

export function mapDispatchToProps(dispatch: Dispatch<MortgageAction>) {
  return {
    updateState: (payload: MortgageState) => {
      return dispatch(mortgageActions.copy(payload));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MortgageComponent);
