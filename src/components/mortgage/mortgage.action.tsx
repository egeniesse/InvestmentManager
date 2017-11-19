import { MortgageState, COPY_MORTGAGE } from './mortgage.types';

export const mortgageActions = {
  copy: (payload: MortgageState) => {
    return { type: COPY_MORTGAGE, payload };
  }
};
