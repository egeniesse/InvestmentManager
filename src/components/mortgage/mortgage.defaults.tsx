import { MortgageState } from './mortgage.types';
export const defaultMortgageState: MortgageState = {
  id: '1',
  name: 'Rental 1',
  loanAmount: 100000,
  closingCosts: 5000,
  downPayment: 20000,
  interestRate: 4.5,
  termYears: 30,
  paidAgainstPrincipal: 0,
  interestPaid: 0
};