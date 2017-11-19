import { MortgageState } from '../mortgage/mortgage.types';

export interface StoreState {
  mortgage: MortgageState
}

export type ThingType = 'Property' | 'Mortgage';