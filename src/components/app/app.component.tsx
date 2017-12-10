import * as React from 'react';
import './App.css';
import { AppRoutes } from './app.routes';
import DrawerContainer from '../drawer/drawer.container';

export class AppComponent extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="header">Investment Manager</div>
        <DrawerContainer/>
        <div className="page-container">
          <AppRoutes/>
        </div>
      </div>
    );
  }
}
