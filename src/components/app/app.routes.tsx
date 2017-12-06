import * as React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { Route } from 'react-router';
import { history } from './app.store';
import PortfolioContainer from '../portfolio/portfolio.container';

export class AppRoutes extends React.Component {
  render() {
    return (
      <ConnectedRouter history={history}>
        <div>
          <Route exact path="/" component={PortfolioContainer}/>
          <Route path="/portfolio" component={PortfolioContainer}/>
        </div>
      </ConnectedRouter>
    );
  }
}
