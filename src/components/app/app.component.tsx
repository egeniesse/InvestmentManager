import * as React from 'react';
import './App.css';
import { AppRoutes } from './app.routes';

export class AppComponent extends React.Component {
  render() {
    return (
      <div className="App">
        <AppRoutes/>
      </div>
    );
  }
}
