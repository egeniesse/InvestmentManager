import * as React from 'react';
import PortfolioContainer from '../portfolio/portfolio.container';
import './App.css';

const logo = require('../../assets/logo.svg');

export class AppComponent extends React.Component {

  render() {
    console.log('here now')
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Reac Eric</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <PortfolioContainer />
      </div>
    );
  }
}

