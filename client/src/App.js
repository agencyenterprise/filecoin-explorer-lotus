import React from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { ChainPage } from './components/ChainPage'

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={ChainPage} />
          <Redirect to="/" />
        </Switch>
      </Router>
    )
  }
}

export default App
