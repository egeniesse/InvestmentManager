import * as React from 'react';
export interface MortgageState {
  id: string;
  homeValue: number;
  closingCosts: number;
  downPayment: number;
  interestRate: number;
  termYears: number;
  interestPaid: number;
  name: string;
  paidAgainstPrincipal: number;
  isDeleted?: boolean;
}

export interface MonthlyPaymentBreakdown {
  monthPaidAgainstPrincipal: number;
  monthInterestPaid: number;
  totalPaidAgainstPrincipal: number;
  totalInterestPaid: number;
  balanceRemaining: number;
}

export const COPY_MORTGAGE = 'COPY_MORTGAGE';
export type COPY_MORTGAGE = typeof COPY_MORTGAGE;

export type CopyMortgageRequest = {
  type: COPY_MORTGAGE,
  payload: MortgageState
};

export type MortgageAction = COPY_MORTGAGE;
export type MortgageRequest = CopyMortgageRequest;
export type MortgagesById = { [mortgageId: string]: MortgageState };
export type EventHandler = { [value: string]: (event: React.ChangeEvent<HTMLInputElement>) => void };
