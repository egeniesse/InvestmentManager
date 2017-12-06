import { mortgagesById } from '../mortgage/mortgage.reducer';
import { propertiesById } from '../property/property.reducer';
import { portfolioState } from '../portfolio/portfolio.reducer';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
  portfolioState,
  mortgagesById,
  propertiesById,
  router: routerReducer
});
