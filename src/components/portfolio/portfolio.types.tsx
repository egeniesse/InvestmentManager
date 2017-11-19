export interface PortfolioState {
  propertyIds: Array<string>;
}

export const COPY_PORTFOLIO = 'COPY_PORTFOLIO';
export type COPY_PORTFOLIO = typeof COPY_PORTFOLIO;

export type CopyPortfolioRequest = {
  type: COPY_PORTFOLIO,
  payload: PortfolioState
};

export type PortfolioAction = COPY_PORTFOLIO;
export type PortfolioRequest = CopyPortfolioRequest;
