import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { AppComponent } from './components/app/app.component';
import { StoreState } from './components/app/app.store';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(
  <MuiThemeProvider>
    <Provider store={StoreState}>
      <AppComponent />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
