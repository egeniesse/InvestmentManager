import { COPY_PORTFOLIO, PortfolioState } from './portfolio.types';

export const portfolioActions = {
  copy: (payload: PortfolioState) => {
    return { type: COPY_PORTFOLIO, payload };
  }
};
