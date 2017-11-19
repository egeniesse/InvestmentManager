import { MortgagesById, MortgageState, COPY_MORTGAGE, MortgageRequest } from './mortgage.types';
import { simpleCopy } from '../../utils';

export function mortgagesById(state: MortgagesById = {}, action: MortgageRequest): MortgagesById {
  switch (action.type) {
    case COPY_MORTGAGE: return copy(state, action.payload);
    default: return state;
  }
}

function copy(state: MortgagesById, payload: MortgageState): MortgagesById {
  const copyState = simpleCopy(state);
  copyState[payload.id] = Object.assign(copyState[payload.id] || {}, payload);
  return copyState;
}
