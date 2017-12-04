import { PortfolioState, COPY_PORTFOLIO, PortfolioRequest } from './portfolio.types';

export function portfolioState(
  state: PortfolioState = { propertyIds: [], activeProperty: [] },
  action: PortfolioRequest
): PortfolioState {
  switch (action.type) {
    case COPY_PORTFOLIO: return copy(state, action.payload);
    default: return state;
  }
}

function copy(state: PortfolioState, payload: PortfolioState): PortfolioState {
  return Object.assign({}, state, payload);
}
