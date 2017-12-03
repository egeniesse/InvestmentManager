import * as React from 'react';
import PortfolioContainer from '../portfolio/portfolio.container';
import './App.css';

export class AppComponent extends React.Component {
  render() {
    return (
      <div className="App">
        <PortfolioContainer />
      </div>
    );
  }
}
