import React from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { App } from './app.styled'
import { ChainPage } from './components/ChainPage'
import { StateProvider } from './context/store'
class AppComponent extends React.Component {
  render() {
    return (
      <App>
        <StateProvider>
          <Router>
            <Switch>
              <Route exact path="/" component={ChainPage} />
              <Redirect to="/" />
            </Switch>
          </Router>
        </StateProvider>
      </App>
    )
  }
}

export default AppComponent
