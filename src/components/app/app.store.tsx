import { createStore } from 'redux';
import { MortgagesById } from '../mortgage/mortgage.types';
import { PropertiesById } from '../property/property.types';
import { PortfolioState } from '../portfolio/portfolio.types';
import reducer from './app.reducer';

export let StoreState = createStore(reducer);

export interface StoreState {
  portfolioState: PortfolioState,
  mortgagesById: MortgagesById,
  propertiesById: PropertiesById
}

