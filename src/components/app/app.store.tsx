import { createStore, applyMiddleware } from 'redux';
import { MortgagesById } from '../mortgage/mortgage.types';
import { PropertiesById } from '../property/property.types';
import { PortfolioState } from '../portfolio/portfolio.types';
import reducer from './app.reducer';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';

// Create a history of your choosing (we're using a browser history in this case)
export const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
export const middleware = routerMiddleware(history);

export let StoreState = createStore(reducer, applyMiddleware(middleware));

export interface StoreState {
  portfolioState: PortfolioState;
  mortgagesById: MortgagesById;
  propertiesById: PropertiesById;
}
