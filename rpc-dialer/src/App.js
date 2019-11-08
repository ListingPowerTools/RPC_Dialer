import React from 'react';
import RootContainer from './Components/RootContainer'

import { Provider } from 'react-redux'
import store from './store.js'

function App() {
  return (
    <Provider store={ store }>
      <div className="App">
        <RootContainer />
      </div>
    </Provider>
  );
}

export default App;
