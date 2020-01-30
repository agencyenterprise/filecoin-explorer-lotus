import React from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { ChainPage } from './components/ChainPage'
import { StateProvider } from './context/store'

class App extends React.Component {
  render() {
    return (
      <StateProvider>
        <Router>
          <Switch>
            <Route exact path="/" component={ChainPage} />
            <Redirect to="/" />
          </Switch>
        </Router>
      </StateProvider>
    )
  }
}

export default App
