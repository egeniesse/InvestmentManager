import * as React from 'react';
import PortfolioContainer from '../portfolio/portfolio.container';
import './App.css';

const logo = require('../../assets/logo.svg');

export class AppComponent extends React.Component {

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </div>

        <PortfolioContainer />
      </div>
    );
  }
}
